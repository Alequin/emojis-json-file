const fs = require("fs");
const transformEmojis = require("./transform-emojis");
const mergeSkinToneEmojis = require("./merge-skin-tone-emojis");
const { snakeCase, flow } = require("lodash");

flow(
  () => fs.readFileSync(`${__dirname}/../raw-emojis.txt`).toString(),
  transformEmojis,
  mergeSkinToneEmojis,
  emojis =>
    fs.writeFileSync(`${__dirname}/../emojis.json`, JSON.stringify(emojis))
)();
