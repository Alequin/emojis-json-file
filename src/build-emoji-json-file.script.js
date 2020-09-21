const fs = require("fs");
const transformEmojis = require("./transform-emojis");
const mergeSkinToneEmojis = require("./merge-skin-tone-emojis");
const { snakeCase, flow, uniqBy } = require("lodash");

const readRawEmojiFile = () =>
  fs.readFileSync(`${__dirname}/../raw-emojis.txt`).toString();

const filterEmojisWithDuplicateNames = emojis =>
  uniqBy(emojis, ({ name }) => name);

const writeEmojisToJson = emojis =>
  fs.writeFileSync(`${__dirname}/../emojis.json`, JSON.stringify(emojis));

flow(
  readRawEmojiFile,
  transformEmojis,
  filterEmojisWithDuplicateNames,
  mergeSkinToneEmojis,
  writeEmojisToJson
)();
