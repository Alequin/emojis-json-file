const fs = require("fs");
const { snakeCase, flow } = require("lodash");
const skinToneNames = require("./skin-tone-names");

const NEW_LINE_CHARACTERS = /(?:\\[rn]|[\r\n]+)+/g;

const transformEmojis = rawEmojis => {
  const groupName = valueTracker(nextGroupName);
  const subgroupName = valueTracker(nextSubgroupName);

  return rawEmojis
    .replace(NEW_LINE_CHARACTERS, "~")
    .split("~")
    .filter(line => line)
    .map((line, index) => {
      const currentGroupName = groupName(line);
      const currentSubgroupName = subgroupName(line);
      if (!startsWithNumber(line)) return null;

      const { emoji, name } = extractDetailsFromLine(line);
      if (!emoji || !name) return null;

      return {
        emoji,
        name,
        displayName: name.replace(/_/g, " "),
        group: currentGroupName,
        subgroup: currentSubgroupName,
        skinTone: skinToneNames.reduce(
          (currentTone, tone) => (name.includes(tone) ? tone : currentTone),
          "neutral"
        )
      };
    })
    .filter(emojiData => emojiData);
};

const valueTracker = nextValueCallback => {
  let value = null;
  return (...args) => {
    const nextValue = nextValueCallback(...args);
    if (nextValue) value = nextValue;
    return value;
  };
};

const nextGroupName = line => {
  const matches = line.match(/^#\sgroup:\s(.*)/);
  return matches ? matches[1] : null;
};

const nextSubgroupName = line => {
  const matches = line.match(/^#\ssubgroup:\s(.*)/);
  return matches ? matches[1] : null;
};

const startsWithNumber = line => /^\d/.test(line);

const extractDetailsFromLine = flow(
  line => line.split("#")[1],
  line => line.trim().split(" "),
  ([emoji, ...names]) => ({
    emoji,
    name: names.join("_").replace(":", "").replace(/-/g, "_").toLowerCase()
  })
);

module.exports = transformEmojis;
