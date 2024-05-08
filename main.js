import "./style.css";
import Split from "split-grid";
import "./console.js";
import {encode, decode} from "js-base64";
import * as monaco from "monaco-editor";

import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import JsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import {generateConsoleScript} from "./console-script.js";

window.MonacoEnvironment = {
  getWorker: (_, label) => {
    if (label === "html") {
      return new HtmlWorker();
    }
    if (label === "css") {
      return new CssWorker();
    }
    if (label === "javascript") {
      return new JsWorker();
    }
  },
};

const getEl = (selector) => document.querySelector(selector);

const split = Split({
  rowGutters: [
    {
      track: 1,
      element: document.querySelector(".horizontal-gutter"),
    },
  ],
});

const $jsButton = getEl("#jsButton");
const $tsButton = getEl("#tsButton");
const $htmlButton = getEl("#htmlButton");
const $cssButton = getEl("#cssButton");
const $terminalButton = getEl("#btn");
const $preview = getEl("#preview");
const $gutter = getEl("#horizontal-gutter");
let fullscreen = false;

const $js = getEl("#js");
const $ts = getEl("#ts");
const $html = getEl("#html");
const $css = getEl("#css");

// Escuchando botones

$terminalButton.addEventListener("click", () => {
  !fullscreen
    ? (document.querySelector(".grid").style["grid-template-rows"] =
        "0px 0px 100% ")
    : (document.querySelector(".grid").style["grid-template-rows"] =
        "1fr 10px 1fr ");
  $gutter.setAttribute("style", !fullscreen ? "display: none" : "");
  fullscreen = !fullscreen;
});

$jsButton.addEventListener("click", () => {
  updateTabSelect("javascript");
});
$tsButton.addEventListener("click", () => {
  updateTabSelect("ts");
});
$htmlButton.addEventListener("click", () => {
  updateTabSelect("html");
});
$cssButton.addEventListener("click", () => {
  updateTabSelect("css");
});

function update() {
  const html = htmlEditor.getValue();
  const css = cssEditor.getValue();
  const js = jsEditor.getValue();

  const hashedCode = `${encode(html)}|${encode(css)}|${encode(js)}`;

  window.history.replaceState(null, null, `/${hashedCode}`);

  const createhtml = createHtml({html, css, js});
  getEl("iframe").setAttribute("srcdoc", createhtml);
}

const {pathname} = window.location;

const [recoverHtml, recoverCss, recoverJs] = pathname.slice(1).split("%7C");

const html = recoverHtml && decode(recoverHtml);
const css = recoverCss && decode(recoverCss);
const js = recoverJs && decode(recoverJs);
// const ts = decode(recoverTs);

const DEFAULT_EDITOR_SETTINGS = {
  automaticLayout: true,
  fontSize: 16,
  theme: "vs-dark",
  padding: {top: 24},
};

const htmlEditor = monaco.editor.create($html, {
  value: html,
  language: "html",
  ...DEFAULT_EDITOR_SETTINGS,
});
const cssEditor = monaco.editor.create($css, {
  value: css,
  language: "css",
  ...DEFAULT_EDITOR_SETTINGS,
});
const jsEditor = monaco.editor.create($js, {
  value: js,
  language: "javascript",
  ...DEFAULT_EDITOR_SETTINGS,
});

// Escuchando editors

htmlEditor.onDidChangeModelContent(update);
cssEditor.onDidChangeModelContent(update);
jsEditor.onDidChangeModelContent(update);
// tsEditor.onDidChangeModelContent(update);

const createhtml = createHtml({html, css, js});
getEl("iframe").setAttribute("srcdoc", createhtml);

function createHtml({html, css, js}) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <style>
        ${css}
      </style>
      ${generateConsoleScript({html, css})}
    </head>
    <body>
      ${html}
      <script>
      ${js}
      </script>
      
      
    </body>
  </html>
  `;
}

function updateTabSelect(type) {
  const types = [
    {type: "javascript", element: $js},
    {type: "ts", element: $ts},
    {type: "html", element: $html},
    {type: "css", element: $css},
  ];
  types.map((t) => {
    t.type === type
      ? t.element.setAttribute("class", "editor")
      : t.element.setAttribute("class", "editor-inactivo");
  });
}

document.querySelector(".btn").onclick = function () {
  this.classList.toggle("fullscreen");
};
// investigar ts
// <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
//       <script type="text/babel">
//       ${ts}
//       </script>
