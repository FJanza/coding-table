// Snippets de JavaScript (ES6) code snippets extension
// Solo datos puros, sin referencias a monaco
export const jsSnippets = [
  {
    label: "imp",
    insertText: "import $1 from '$2';",
    documentation: "imports entire module",
  },
  {
    label: "imn",
    insertText: "import '$1';",
    documentation: "imports entire module without module name",
  },
  {
    label: "imd",
    insertText: "import { $1 } from '$2';",
    documentation: "imports only a portion of the module using destructuring",
  },
  {
    label: "ime",
    insertText: "import * as $1 from '$2';",
    documentation: "imports everything as alias from the module",
  },
  {
    label: "ima",
    insertText: "import { $1 as $2 } from '$3';",
    documentation: "imports only a portion of the module as alias",
  },
  {
    label: "rqr",
    insertText: "require('$1');",
    documentation: "require package",
  },
  {
    label: "req",
    insertText: "const $1 = require('$2');",
    documentation: "require package to const",
  },
  {
    label: "mde",
    insertText: "module.exports = {};",
    documentation: "default module.exports",
  },
  {
    label: "env",
    insertText: "export const $1 = $2;",
    documentation: "exports name variable",
  },
  {
    label: "enf",
    insertText: "export const $1 = ($2) => { console.log($2); };",
    documentation: "exports name function",
  },
  {
    label: "edf",
    insertText: "export default function $1($2) { console.log($2); }",
    documentation: "exports default function",
  },
  {
    label: "ecl",
    insertText: "export default class $1 { }",
    documentation: "exports default class",
  },
  {
    label: "ece",
    insertText: "export default class $1 extends $2 { }",
    documentation: "exports default class by extending a base one",
  },
  {
    label: "con",
    insertText: "constructor() {\n  $0\n}",
    documentation: "default constructor in the class",
  },
  {
    label: "met",
    insertText: "$1() {\n  $0\n}",
    documentation: "method inside a class",
  },
  {
    label: "pge",
    insertText: "get $1() {\n  return $0;\n}",
    documentation: "getter property",
  },
  {
    label: "pse",
    insertText: "set $1(value) {\n  $0\n}",
    documentation: "setter property",
  },
  {
    label: "fre",
    insertText: "$1.forEach($2 => {\n  $0\n});",
    documentation: "forEach loop in ES6 syntax",
  },
  {
    label: "fof",
    insertText: "for (const $1 of $2) {\n  $0\n}",
    documentation: "for ... of loop",
  },
  {
    label: "fin",
    insertText: "for (const $1 in $2) {\n  $0\n}",
    documentation: "for ... in loop",
  },
  {
    label: "anfn",
    insertText: "($1) => {\n  $0\n}",
    documentation: "anonymous function",
  },
  {
    label: "nfn",
    insertText: "const $1 = ($2) => {\n  $0\n};",
    documentation: "named function",
  },
  {
    label: "dob",
    insertText: "const { $1 } = $2;",
    documentation: "destructuring object",
  },
  {
    label: "dar",
    insertText: "const [ $1 ] = $2;",
    documentation: "destructuring array",
  },
  {
    label: "sti",
    insertText: "setInterval(() => {\n  $0\n}, $1);",
    documentation: "setInterval helper",
  },
  {
    label: "sto",
    insertText: "setTimeout(() => {\n  $0\n}, $1);",
    documentation: "setTimeout helper",
  },
  {
    label: "prom",
    insertText: "return new Promise((resolve, reject) => {\n  $0\n});",
    documentation: "new Promise",
  },
  {
    label: "thenc",
    insertText: ".then(res => { $0 }).catch(err => { })",
    documentation: "then/catch",
  },
  {
    label: "cas",
    insertText: "console.assert($1, $2);",
    documentation: "console.assert",
  },
  {
    label: "ccl",
    insertText: "console.clear();",
    documentation: "console.clear",
  },
  {
    label: "cco",
    insertText: "console.count($1);",
    documentation: "console.count",
  },
  {
    label: "cdb",
    insertText: "console.debug($1);",
    documentation: "console.debug",
  },
  {label: "cdi", insertText: "console.dir($1);", documentation: "console.dir"},
  {
    label: "cer",
    insertText: "console.error($1);",
    documentation: "console.error",
  },
  {
    label: "cgr",
    insertText: "console.group($1);",
    documentation: "console.group",
  },
  {
    label: "cge",
    insertText: "console.groupEnd();",
    documentation: "console.groupEnd",
  },
  {label: "clg", insertText: "console.log($1);", documentation: "console.log"},
  {
    label: "clo",
    insertText: "console.log('$1 :>> ', $1);",
    documentation: "console.log object with name",
  },
  {
    label: "ctr",
    insertText: "console.trace($1);",
    documentation: "console.trace",
  },
  {
    label: "cwa",
    insertText: "console.warn($1);",
    documentation: "console.warn",
  },
  {
    label: "cin",
    insertText: "console.info($1);",
    documentation: "console.info",
  },
  {
    label: "clt",
    insertText: "console.table($1);",
    documentation: "console.table",
  },
  {
    label: "cti",
    insertText: "console.time($1);",
    documentation: "console.time",
  },
  {
    label: "cte",
    insertText: "console.timeEnd($1);",
    documentation: "console.timeEnd",
  },
];
