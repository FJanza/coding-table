import "./style.css";
import Split from "split-grid";
import {encode, decode} from "js-base64";

const getEl = (selector) => document.querySelector(selector);

Split({
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

const $js = getEl("#js");
const $ts = getEl("#ts");
const $html = getEl("#html");
const $css = getEl("#css");

updateTabSelect("html");

// Escuchando botones

$jsButton.addEventListener("click", () => {
  updateTabSelect("js");
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

// Escuchando text-areas

$js.addEventListener("input", () => {
  update();
});

$ts.addEventListener("input", () => {
  update();
});

$html.addEventListener("input", () => {
  update();
});

$css.addEventListener("input", () => {
  update();
});

function updateTabSelect(type) {
  const types = [
    {type: "js", element: $js},
    {type: "ts", element: $ts},
    {type: "html", element: $html},
    {type: "css", element: $css},
  ];
  types.map((t) => {
    t.type === type
      ? t.element.setAttribute("class", "")
      : t.element.setAttribute("class", "textarea-inactiva");
  });
}

function update() {
  const html = $html.value;
  const css = $css.value;
  const js = $js.value;

  const hashedCode = `${encode(html)}|${encode(css)}|${encode(js)}`;

  window.history.replaceState(null, null, `/${hashedCode}`);

  const createhtml = createHtml({html, css, js});
  getEl("iframe").setAttribute("srcdoc", createhtml);
}

function initialize() {
  const {pathname} = window.location;

  const [recoverHtml, recoverCss, recoverJs] = pathname.slice(1).split("%7C");

  const html = decode(recoverHtml);
  const css = decode(recoverCss);
  const js = decode(recoverJs);

  $html.value = html;
  $css.value = css;
  $js.value = js;

  const createhtml = createHtml({html, css, js});
  getEl("iframe").setAttribute("srcdoc", createhtml);
}

function createHtml({html, css, js}) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <style>
        ${css}
      </style>
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

initialize();

// investigar ts
// <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
//       <script type="text/babel">
//       ${ts}
//       </script>
