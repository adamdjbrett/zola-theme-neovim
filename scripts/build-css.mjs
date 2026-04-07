import fs from "node:fs";
import path from "node:path";
import { compile } from "sass";

const cwd = process.cwd();
const sourceRoot = path.join(cwd, "css");
const outputRoot = path.join(cwd, "public", "css");

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
      continue;
    }
    if (!entry.isFile()) continue;
    if (!/\.(scss|sass)$/i.test(entry.name)) continue;
    if (entry.name.startsWith("_")) continue;
    out.push(full);
  }
  return out;
}

if (!fs.existsSync(sourceRoot)) {
  console.log("[build:css] No css source directory; skipping.");
  process.exit(0);
}

const files = walk(sourceRoot);
if (!files.length) {
  console.log("[build:css] No non-partial sass/scss entry files; skipping.");
  process.exit(0);
}

let failed = 0;
for (const src of files) {
  const rel = path.relative(sourceRoot, src);
  const out = path.join(outputRoot, rel).replace(/\.(scss|sass)$/i, ".css");
  fs.mkdirSync(path.dirname(out), { recursive: true });

  try {
    const result = compile(src, {
      loadPaths: [sourceRoot, cwd, path.join(cwd, "node_modules")],
      style: "expanded",
      sourceMap: false
    });
    fs.writeFileSync(out, result.css, "utf8");
    console.log(`[build:css] ${rel} -> ${path.relative(cwd, out)}`);
  } catch (err) {
    failed += 1;
    console.error(`[build:css] Failed: ${rel}`);
    console.error(String(err?.message || err));
  }
}

if (failed > 0) {
  process.exitCode = 1;
} else {
  console.log(`[build:css] Compiled ${files.length} stylesheet(s).`);
}
