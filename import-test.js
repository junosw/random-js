/*
Node.js has included experimental support for ES6 support. Read more about here: https://nodejs.org/docs/latest-v13.x/api/esm.html#esm_enabling.

TLDR;

Node >= v13

It's very simple in Node 13 and above. You need to either:

Save the file with .mjs extension, or

Add { "type": "module" } in the nearest package.json.

JT: TESTED BOTH, WORKS. NOTE:
all files involved need the mjs extension

You only need to do one of the above to be able to use ES modules.

Node <= v12

If you are using Node version 8-12, Save the file with ES6 modules with .mjs extension and run it like:

node --experimental-modules my-app.mjs
*/

import { foo } from "./export-test.js";

console.log(foo);
