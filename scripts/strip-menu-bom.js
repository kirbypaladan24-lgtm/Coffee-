// Sanitizes src/data/menu.json before dev/build.
//
// Why: some Windows editors (e.g. Notepad) save JSON as UTF-8 *with* BOM,
// and Next's JSON import chokes on the BOM with "Unable to make a module
// from invalid JSON". This strips a leading BOM when present and validates
// the JSON with a readable error, so a bad hand-edit fails here with a
// clear message instead of a cryptic Turbopack frame.
//
// NOTE: the BOM is detected on raw bytes — fs.readFileSync(..., "utf8")
// silently swallows it, so a charCodeAt check can never see it.
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "src", "data", "menu.json");
let buf = fs.readFileSync(file);

if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
  buf = buf.subarray(3);
  fs.writeFileSync(file, buf);
  console.log("[menu] stripped UTF-8 BOM from src/data/menu.json");
}

try {
  JSON.parse(buf.toString("utf8"));
} catch (err) {
  console.error(`[menu] src/data/menu.json is not valid JSON: ${err.message}`);
  process.exit(1);
}
