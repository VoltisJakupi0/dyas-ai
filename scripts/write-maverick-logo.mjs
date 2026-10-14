import { writeFileSync } from "node:fs";
import { Buffer } from "node:buffer";

const urls = [
  "https://framerusercontent.com/images/cQnM0csKKd1MZmjlg2e3KZ8xav4.png",
  "https://framerusercontent.com/images/TnARkRVlmovocFAqqksAJhXo4.png",
];

const wordmark = await fetch(urls[0]).then((r) => r.arrayBuffer());
writeFileSync("public/logos/maverick.png", Buffer.from(wordmark));
console.log("wordmark", wordmark.byteLength);

const square = await fetch(urls[1]).then((r) => r.arrayBuffer());
writeFileSync("public/logos/maverick-mark.png", Buffer.from(square));
console.log("square", square.byteLength);
