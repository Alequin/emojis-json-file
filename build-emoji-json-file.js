const fs = require("fs");
const { snakeCase, flow } = require("lodash");

const main = () => {
  fs.writeFileSync(
    `./emojis.json`,
    JSON.stringify(transformEmojis(`./raw-emojis.txt`))
  );
};

const skinTones = [
  "light_skin_tone",
  "dark_skin_tone",
  "medium_skin_tone",
  "medium_light_skin_tone",
  "medium_dark_skin_tone"
];

const NEW_LINE_CHARACTERS = /(?:\\[rn]|[\r\n]+)+/g;

const transformEmojis = filePath => {
  const groupName = valueTracker(nextGroupName);
  const subgroupName = valueTracker(nextSubgroupName);

  return fs
    .readFileSync(filePath)
    .toString()
    .replace(NEW_LINE_CHARACTERS, "~")
    .split("~")
    .filter(line => line)
    .map(line => {
      const currentGroupName = groupName(line);
      const currentSubgroupName = subgroupName(line);
      if (!startsWithNumber(line)) return null;

      const { emoji, name } = extractDetailsFromLine(line);
      if (!emoji || !name) return null;

      return {
        emoji,
        name,
        group: currentGroupName,
        subgroup: currentSubgroupName,
        skinTone: skinTones.reduce(
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
    name: names.join("_").replace(":", "").replace(/-/g, "_")
  })
);

if (require.main === module) main();
