const CONSOLE_ICONS = {
  "log:info": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.002 2c5.523 0 10.001 4.478 10.001 10.002 0 5.523-4.478 10.001-10.001 10.001C6.478 22.003 2 17.525 2 12.002 2 6.478 6.478 2 12.002 2Zm0 1.5a8.502 8.502 0 1 0 0 17.003 8.502 8.502 0 0 0 0-17.003Zm-.004 7a.75.75 0 0 1 .744.648l.006.102.004 5.502a.75.75 0 0 1-1.493.102l-.007-.101-.004-5.502a.75.75 0 0 1 .75-.75Zm.004-3.497a.999.999 0 1 1 0 1.997.999.999 0 0 1 0-1.997Z" fill="currentColor"/>
  </svg>`,
  "log:error": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2c5.523 0 10 4.478 10 10s-4.477 10-10 10S2 17.522 2 12 6.477 2 12 2Zm0 1.667c-4.595 0-8.333 3.738-8.333 8.333 0 4.595 3.738 8.333 8.333 8.333 4.595 0 8.333-3.738 8.333-8.333 0-4.595-3.738-8.333-8.333-8.333Zm-.001 10.835a.999.999 0 1 1 0 1.998.999.999 0 0 1 0-1.998ZM11.994 7a.75.75 0 0 1 .744.648l.007.101.004 4.502a.75.75 0 0 1-1.493.103l-.007-.102-.004-4.501a.75.75 0 0 1 .75-.751Z" fill="currentColor"/>
  </svg>`,
  "log:warn": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12.997 17.002a.999.999 0 1 0-1.997 0 .999.999 0 0 0 1.997 0Zm-.259-7.853a.75.75 0 0 0-1.493.103l.004 4.501.007.102a.75.75 0 0 0 1.493-.103l-.004-4.502-.007-.101Zm1.23-5.488c-.857-1.548-3.082-1.548-3.938 0L2.284 17.662c-.83 1.5.255 3.34 1.97 3.34h15.49c1.714 0 2.799-1.84 1.97-3.34L13.966 3.661Zm-2.626.726a.75.75 0 0 1 1.313 0L20.4 18.388a.75.75 0 0 1-.657 1.113H4.254a.75.75 0 0 1-.657-1.113l7.745-14.001Z" fill="currentColor"/>
  </svg>`,
  "log:log": `<svg width="24" height="24" viewBox="-4 -5 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.243 7.071l-4.95-4.95A1 1 0 1 1 1.707.707l5.657 5.657a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 0 1-1.414-1.414l4.95-4.95zM6.929 12h8a1 1 0 0 1 0 2h-8a1 1 0 0 1 0-2z" fill="currentColor"/></svg>`,
  error: null,
};

const getEl = (selector) => document.querySelector(selector);

const $iframe = getEl("iframe");
const $consoleList = getEl("#console .console-list");

const clearConsole = () => {
  $consoleList.innerHTML = "";
};

const isPrimitive = (item) => {
  return (
    ["string", "number", "boolean", "symbol", "bigint"].includes(typeof item) ||
    item === null ||
    item === undefined
  );
};

const createListItem = (content, type) => {
  const $li = document.createElement("li");
  $li.classList.add(`log-${type.split(":")[1]}`);
  $li.innerHTML = CONSOLE_ICONS[type];
  const $span = document.createElement("span");
  $span.textContent = content;
  $li.appendChild($span);
  return $li;
};

const handlers = {
  system: (payload) => {
    if (payload === "clear") {
      clearConsole();
    }
  },
  error: (payload) => {
    const {line, column, message} = payload;
    const errorItem = createListItem(`${line}:${column} ${message}`, "error");
    errorItem.classList.add("error");
    $consoleList.appendChild(errorItem);
  },
  default: (payload, type) => {
    const content =
      Number.isNaN(payload.find(isPrimitive)) || payload.find(isPrimitive)
        ? payload.join(" ")
        : payload.map((item) => JSON.stringify(item)).join(" ");

    const listItem = createListItem(content, type);
    $consoleList.appendChild(listItem);
  },
  loop: (payload) => {
    clearConsole();
    const {message} = payload;
    const errorItem = createListItem(`${message}`, "error");
    errorItem.classList.add("error");
    $consoleList.appendChild(errorItem);
  },
};

window.addEventListener("message", (ev) => {
  const {console: consoleData} = ev.data;

  const payload = consoleData?.payload;
  const type = consoleData?.type;

  if (ev.source === $iframe.contentWindow) {
    const handler = handlers[type] || handlers.default;
    handler(payload, type);
  } else if (type === "loop") {
    handlers.loop(payload);
  }
});
