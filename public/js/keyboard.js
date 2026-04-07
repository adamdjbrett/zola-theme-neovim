function exec(event) {
  let element = document.activeElement;
  const customKeys =
    typeof window !== "undefined" && window.keys ? window.keys : null;

  const key = event.key.toLocaleLowerCase();
  const is_page = element.classList.contains("page");
  const is_viewer = element.id == "viewer";
  const is_files = element.id == "files";
  const is_prompt = element.id == "setter";

  if (key != "r" && (is_viewer || is_files)) event.preventDefault();

  element = is_viewer ? document.getElementById("content") : element;

  if (event.shiftKey) {
    if (
      customKeys &&
      customKeys.shortcut &&
      typeof customKeys.shortcut[key] === "function"
    ) {
      customKeys.shortcut[key](event, element);
      return;
    }

    switch (key) {
      case "l":
        document.getElementById("viewer").focus();
        Cookies.set("focused", "viewer");
        break;

      case "h":
        document.getElementById("files").focus();
        Cookies.set("focused", "files");
        break;

      case "t":
        new_tab(element);
        break;

      case "q":
        del_tab();
        break;
    }
  } else {
    if (
      customKeys &&
      customKeys.normal &&
      typeof customKeys.normal[key] === "function"
    ) {
      customKeys.normal[key](event, element);
      return;
    }

    switch (key) {
      case "escape":
        document.getElementById("setter").focus();
        document.getElementById("setter").value = "";
        break;

      case "enter":
        if (is_prompt) {
          command();
        } else {
          new_tab(element, true);
        }
        break;

      case "tab":
        if (is_viewer) {
          next_tab();
        }
        break;

      case "j":
        if (is_viewer && is_page) {
          element.scrollBy(0, 30);
        } else if (!is_prompt) {
          next_file(-1, element);
        }
        break;

      case "k":
        if (is_viewer && is_page) {
          element.scrollBy(0, -30);
        } else if (!is_prompt) {
          next_file(1, element);
        }
        break;

      case "l":
        if (!is_prompt) {
          element.scrollBy(30, 0);
        }
        break;

      case "h":
        if (!is_prompt) {
          element.scrollBy(-30, 0);
        }
        break;
    }
  }
}

function next_file(incrementer, element) {
  let a = element.getElementsByClassName("selected")[0];
  if (!a) {
    a = element.querySelector("a[tabindex]");
    if (!a) return;
    a.classList.add("selected");
  }

  const index = parseInt(a.attributes.tabindex.value);
  const next_element = element.querySelector(
    `[tabindex='${index + incrementer}']`,
  );

  if (next_element) {
    next_element.classList.add("selected");
    a.classList.remove("selected");
  }
}
