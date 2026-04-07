import { DateTime } from "luxon";
import pluginRss from "@11ty/eleventy-plugin-rss";
import yaml from "js-yaml";

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizePath = (value) => {
  if (!value) return "/";
  const text = String(value).trim();
  if (text === "/") return "/";
  return `/${text.replace(/^\/+|\/+$/g, "")}/`;
};

const getPublishedPosts = (collectionApi) =>
  collectionApi
    .getFilteredByGlob("content/posts/*.{md,njk,html}")
    .filter((item) => item.data.draft !== true && item.data.published !== false)
    .sort((a, b) => b.date - a.date);

export default function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));
  eleventyConfig.addPassthroughCopy({ public: "/" });
  eleventyConfig.addPassthroughCopy({ ".nojekyll": ".nojekyll" });

  eleventyConfig.addFilter("readableDate", (value, format = "dd LLL yyyy") => {
    const date = toDate(value);
    if (!date) return "";
    return DateTime.fromJSDate(date, { zone: "utc" }).toFormat(format);
  });

  eleventyConfig.addFilter("htmlDateString", (value) => {
    const date = toDate(value);
    if (!date) return "";
    return DateTime.fromJSDate(date, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("isoDate", (value) => {
    const date = toDate(value) || new Date();
    return DateTime.fromJSDate(date, { zone: "utc" }).toUTC().toISO();
  });

  eleventyConfig.addFilter("deployYear", (value) => {
    const date = toDate(value) || new Date();
    return DateTime.fromJSDate(date, { zone: "utc" }).toFormat("yyyy");
  });

  eleventyConfig.addFilter("slugify", (value) =>
    String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  );

  eleventyConfig.addFilter("absoluteUrl", (url, base = "http://localhost:8080") => {
    if (!url) return base;
    return new URL(url, base).toString();
  });

  eleventyConfig.addFilter("json", (value) => JSON.stringify(value ?? ""));

  eleventyConfig.addFilter("urlMatch", (a, b) => normalizePath(a) === normalizePath(b));

  eleventyConfig.addCollection("posts", (collectionApi) => {
    const posts = getPublishedPosts(collectionApi);

    posts.forEach((post, index) => {
      post.data.newerPost = posts[index - 1] || null;
      post.data.olderPost = posts[index + 1] || null;
    });

    return posts;
  });

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set();

    for (const item of getPublishedPosts(collectionApi)) {
      for (const tag of item.data.tags || []) {
        if (["all", "posts"].includes(tag)) continue;
        tags.add(tag);
      }
    }

    return [...tags].sort((a, b) => a.localeCompare(b));
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html", "xsl", "txt", "json"],
    dir: {
      input: "content",
      includes: "../_includes",
      data: "_data",
      output: "_site"
    }
  };
}
