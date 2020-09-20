const fs = require("fs");
const transformEmojis = require("./transform-emojis");
const skinToneNames = require("./skin-tone-names");
const { snakeCase, flow, isEmpty } = require("lodash");

const mergeSkinToneEmojis = emojis =>
  emojis
    .map(emoji => {
      const skinToneOptions = findSkinToneAlts(emojis, emoji);
      return isEmpty(skinToneOptions)
        ? emoji
        : { ...emoji, skinTones: skinToneOptions };
    })
    .filter(({ name }) =>
      skinToneNames.every(skinTone => !name.includes(skinTone))
    );

const findSkinToneAlts = (emojis, { name }) =>
  skinToneNames.reduce((skinToneAlts, skinTone) => {
    const nameWithSkinTone = `${name}_${skinTone}`;
    const emojiSkinToneAlt = emojis.find(
      ({ name }) => name === nameWithSkinTone
    );
    if (emojiSkinToneAlt) skinToneAlts[skinTone] = emojiSkinToneAlt;
    return skinToneAlts;
  }, {});

module.exports = mergeSkinToneEmojis;
