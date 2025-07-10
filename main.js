import "./style.css";
import Split from "split-grid";
import "./console.js";
import {encode, decode} from "js-base64";
import * as monaco from "monaco-editor";
import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import JsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import {generateConsoleScript} from "./console-script.js";
import Swal from "sweetalert2";
import {setupEditorSettingsModal} from "./editor-settings.js";

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

const $copyLink = getEl("#copylink");
const $jsButton = getEl("#jsButton");
const $tsButton = getEl("#tsButton");
const $htmlButton = getEl("#htmlButton");
const $cssButton = getEl("#cssButton");
const $terminalButton = getEl("#btn");
const $gutter = getEl("#horizontal-gutter");
let fullscreen = false;

const $js = getEl("#js");
const $ts = getEl("#ts");
const $html = getEl("#html");
const $css = getEl("#css");

// Escuchando botones

document.querySelector("#btn").onclick = function () {
  this.classList.toggle("fullscreen");
};

$terminalButton.addEventListener("click", () => {
  !fullscreen
    ? (document.querySelector(".grid").style["grid-template-rows"] =
        "0px 0px 3fr")
    : (document.querySelector(".grid").style["grid-template-rows"] =
        "1fr 10px 1fr ");
  $gutter.setAttribute("style", !fullscreen ? "display: none" : "");
  fullscreen = !fullscreen;
});

function changeButtonColor($Button, buttons) {
  buttons.map(($b) => {
    $b.setAttribute(
      "style",
      `background-color: ${$b === $Button ? "#505050" : "#222"}`
    );
  });
}

const $Buttons = [$jsButton, $htmlButton, $cssButton];

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

// Inicializar el modal de settings del editor Monaco
setupEditorSettingsModal({
  monaco,
  editors: [htmlEditor, cssEditor, jsEditor],
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

// investigar ts
// <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
//       <script type="text/babel">
//       ${ts}
//       </script>

// Snippets de JavaScript (ES6) code snippets extension
monaco.languages.registerCompletionItemProvider("javascript", {
  provideCompletionItems: function () {
    return {
      suggestions: [
        // Import and export
        {
          label: "imp",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "import $1 from '$2';",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "imports entire module",
        },
        {
          label: "imn",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "import '$1';",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "imports entire module without module name",
        },
        {
          label: "imd",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "import { $1 } from '$2';",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            "imports only a portion of the module using destructuring",
        },
        {
          label: "ime",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "import * as $1 from '$2';",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "imports everything as alias from the module",
        },
        {
          label: "ima",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "import { $1 as $2 } from '$3';",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "imports only a portion of the module as alias",
        },
        {
          label: "rqr",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "require('$1');",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "require package",
        },
        {
          label: "req",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "const $1 = require('$2');",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "require package to const",
        },
        {
          label: "mde",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "module.exports = {};",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "default module.exports",
        },
        {
          label: "env",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "export const $1 = $2;",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "exports name variable",
        },
        {
          label: "enf",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "export const $1 = ($2) => { console.log($2); };",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "exports name function",
        },
        {
          label: "edf",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "export default function $1($2) { console.log($2); }",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "exports default function",
        },
        {
          label: "ecl",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "export default class $1 { }",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "exports default class",
        },
        {
          label: "ece",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "export default class $1 extends $2 { }",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "exports default class by extending a base one",
        },
        // Class helpers
        {
          label: "con",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "constructor() {\n  $0\n}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "default constructor in the class",
        },
        {
          label: "met",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "$1() {\n  $0\n}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "method inside a class",
        },
        {
          label: "pge",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "get $1() {\n  return $0;\n}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "getter property",
        },
        {
          label: "pse",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "set $1(value) {\n  $0\n}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "setter property",
        },
        // Various methods
        {
          label: "fre",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "$1.forEach($2 => {\n  $0\n});",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "forEach loop in ES6 syntax",
        },
        {
          label: "fof",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "for (const $1 of $2) {\n  $0\n}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "for ... of loop",
        },
        {
          label: "fin",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "for (const $1 in $2) {\n  $0\n}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "for ... in loop",
        },
        {
          label: "anfn",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "($1) => {\n  $0\n}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "anonymous function",
        },
        {
          label: "nfn",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "const $1 = ($2) => {\n  $0\n};",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "named function",
        },
        {
          label: "dob",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "const { $1 } = $2;",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "destructuring object",
        },
        {
          label: "dar",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "const [ $1 ] = $2;",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "destructuring array",
        },
        {
          label: "sti",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "setInterval(() => {\n  $0\n}, $1);",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "setInterval helper",
        },
        {
          label: "sto",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "setTimeout(() => {\n  $0\n}, $1);",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "setTimeout helper",
        },
        {
          label: "prom",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "return new Promise((resolve, reject) => {\n  $0\n});",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "new Promise",
        },
        {
          label: "thenc",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: ".then(res => { $0 }).catch(err => { })",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "then/catch",
        },
        // Console methods
        {
          label: "cas",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "console.assert($1, $2);",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "console.assert",
        },
        {
          label: "ccl",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "console.clear();",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "console.clear",
        },
        {
          label: "cco",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "console.count($1);",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "console.count",
        },
        {
          label: "cdb",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "console.debug($1);",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "console.debug",
        },
        {
          label: "cdi",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "console.dir($1);",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "console.dir",
        },
        {
          label: "cer",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "console.error($1);",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "console.error",
        },
        {
          label: "cgr",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "console.group($1);",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "console.group",
        },
        {
          label: "cge",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "console.groupEnd();",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "console.groupEnd",
        },
        {
          label: "clg",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "console.log($1);",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "console.log",
        },
        {
          label: "clo",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "console.log('$1 :>> ', $1);",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "console.log object with name",
        },
        {
          label: "ctr",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "console.trace($1);",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "console.trace",
        },
        {
          label: "cwa",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "console.warn($1);",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "console.warn",
        },
        {
          label: "cin",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "console.info($1);",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "console.info",
        },
        {
          label: "clt",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "console.table($1);",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "console.table",
        },
        {
          label: "cti",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "console.time($1);",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "console.time",
        },
        {
          label: "cte",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "console.timeEnd($1);",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "console.timeEnd",
        },
      ],
    };
  },
});
