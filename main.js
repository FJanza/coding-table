import "./style.css";
import Split from "split-grid";
import "./console.js";
import {encode, decode} from "js-base64";
import * as monaco from "monaco-editor";
import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import JsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import {generateConsoleScript} from "./console-script.js";
import Swal from "sweetalert2";
import {setupEditorSettingsModal} from "./editor-settings.js";
import {jsSnippets} from "./js-snippets.js";

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
    if (label === "typescript") {
      return new TsWorker();
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

const $copyLink = getEl("#copylink");
const $jsButton = getEl("#jsButton");
const $tsButton = getEl("#tsButton");
const $htmlButton = getEl("#htmlButton");
const $cssButton = getEl("#cssButton");
const $gutter = getEl("#horizontal-gutter");
const $terminalBtn = getEl("#btn");
const $console = getEl(".console");
const $grid = getEl(".grid");
let fullscreen = false;

const $js = getEl("#js");
const $ts = getEl("#ts");
const $html = getEl("#html");
const $css = getEl("#css");
const $consoleList = getEl("#console .console-list");

// Escuchando botones

function changeButtonColor($Button, buttons) {
  buttons.forEach(($b) => {
    $b.classList.remove("active");
  });
  $Button.classList.add("active");
}

const $Buttons = [$jsButton, $htmlButton, $cssButton, $tsButton];

$copyLink.addEventListener("click", async () => {
  await navigator.clipboard.writeText(window.location.href);
  Swal.fire({
    title: "📎 Copied Link! ",
    icon: "success",
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 1500,
    padding: "5px 0 5px 5px",
  });
});
$jsButton.addEventListener("click", () => {
  changeButtonColor($jsButton, $Buttons);
  updateTabSelect("javascript");
});
$tsButton.addEventListener("click", () => {
  changeButtonColor($tsButton, $Buttons);
  updateTabSelect("ts");
});
$htmlButton.addEventListener("click", () => {
  changeButtonColor($htmlButton, $Buttons);
  updateTabSelect("html");
});
$cssButton.addEventListener("click", () => {
  changeButtonColor($cssButton, $Buttons);
  updateTabSelect("css");
});
$terminalBtn.addEventListener("click", () => {
  fullscreen = !fullscreen;
  $terminalBtn.classList.toggle("fullscreen", fullscreen);
  if (fullscreen) {
    $grid.style.gridTemplateRows = "0 0 1fr";
  } else {
    $grid.style.gridTemplateRows = "1fr 10px 1fr";
  }
});

function update() {
  const html = htmlEditor.getValue();
  const css = cssEditor.getValue();
  const js = jsEditor.getValue();
  const ts = tsEditor.getValue();

  // Deshabilitar el editor contrario y el botón si hay código
  if (js.trim() && !ts.trim()) {
    tsEditor.updateOptions({readOnly: true});
    jsEditor.updateOptions({readOnly: false});
    $tsButton.setAttribute("disabled", "disabled");
    $jsButton.removeAttribute("disabled");
  } else if (ts.trim() && !js.trim()) {
    jsEditor.updateOptions({readOnly: true});
    tsEditor.updateOptions({readOnly: false});
    $jsButton.setAttribute("disabled", "disabled");
    $tsButton.removeAttribute("disabled");
  } else if (!js.trim() && !ts.trim()) {
    jsEditor.updateOptions({readOnly: false});
    tsEditor.updateOptions({readOnly: false});
    $jsButton.removeAttribute("disabled");
    $tsButton.removeAttribute("disabled");
  }

  const hashedCode = `${encode(html)}|${encode(css)}|${encode(js)}|${encode(
    ts
  )}`;

  window.history.replaceState(null, null, `/${hashedCode}`);

  // Si hay código TS, lo transpilo a JS para el preview
  let jsToRun = js;
  if (ts && ts.trim()) {
    try {
      jsToRun = window.ts && window.ts.transpile ? window.ts.transpile(ts) : js;
    } catch (e) {
      jsToRun = js + "\n// Error al transpilar TS";
    }
  }

  const createhtml = createHtml({html, css, js: jsToRun});
  getEl("iframe").setAttribute("srcdoc", createhtml);
}

const {pathname} = window.location;

const [recoverHtml, recoverCss, recoverJs, recoverTs] = pathname
  .slice(1)
  .split("%7C");

const html = recoverHtml && decode(recoverHtml);
const css = recoverCss && decode(recoverCss);
const js = recoverJs && decode(recoverJs);
const ts = recoverTs && decode(recoverTs);

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
const tsEditor = monaco.editor.create($ts, {
  value: ts || "",
  language: "typescript",
  ...DEFAULT_EDITOR_SETTINGS,
});

// Inicializar el modal de settings del editor Monaco
setupEditorSettingsModal({
  monaco,
  editors: [htmlEditor, cssEditor, jsEditor, tsEditor],
});

// Escuchando editors
htmlEditor.onDidChangeModelContent(update);
cssEditor.onDidChangeModelContent(update);
jsEditor.onDidChangeModelContent(update);
tsEditor.onDidChangeModelContent(update);

// Sincronizar estado de editores y botones al cargar
update();

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

// investigar ts
// <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
//       <script type="text/babel">
//       ${ts}
//       </script>

// Snippets de JavaScript (ES6) code snippets extension
// Importa los datos puros y mapea a enums de monaco

const jsSnippetsWithEnums = jsSnippets.map((snippet) => ({
  ...snippet,
  kind: monaco.languages.CompletionItemKind.Snippet,
  insertTextRules:
    monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
}));

monaco.languages.registerCompletionItemProvider("javascript", {
  provideCompletionItems: function () {
    return {
      suggestions: jsSnippetsWithEnums,
    };
  },
});
monaco.languages.registerCompletionItemProvider("typescript", {
  provideCompletionItems: function () {
    return {
      suggestions: jsSnippetsWithEnums,
    };
  },
});

function clearConsole() {
  $consoleList.innerHTML = "";
}

// Modificar el eventListener para una sola terminal
window.addEventListener("message", (ev) => {
  const {console: consoleData} = ev.data;
  if (!consoleData) return;
  const payload = consoleData?.payload;
  const type = consoleData?.type;
  if (type === "system" && payload === "clear") {
    clearConsole();
    return;
  }
  // ...lógica para crear y agregar el log a $consoleList...
});

// Al cargar, marcar el botón activo según el editor visible
function setInitialActiveButton() {
  const editors = [
    {el: $js, btn: $jsButton},
    {el: $ts, btn: $tsButton},
    {el: $html, btn: $htmlButton},
    {el: $css, btn: $cssButton},
  ];
  const active = editors.find(({el}) => el.classList.contains("editor"));
  if (active) {
    changeButtonColor(active.btn, $Buttons);
  }
}

// Llamar después de updateTabSelect o al cargar
setInitialActiveButton();
