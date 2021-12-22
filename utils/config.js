//A friend showed me this file and said I can use it for the bot

module.exports = {
  wait: (time) => new Promise((resolve) => setTimeout(resolve, time)),
  /**
   * @description Retrieves ONLY numbers from a string
   * @param {String} str
   * @returns {String}
   */
  getDigit(str) {
    return str.replace(/[^0-9]/g, "");
  },
  boldWrap(str) {
    return "**".concat(str).concat("**");
  },
  singleWrap(str) {
    return "`".concat(str).concat("`");
  },
  tripleWrap(str) {
    return "```".concat(str).concat("```");
  },
  underlineWrap(str) {
    return "__".concat(str).concat("__");
  },
  italicsWrap(str) {
    return "_".concat(str).concat("_");
  },
  spoilerWrap(str) {
    return "||".concat(str).concat("||");
  },
  redWrap(str) {
    return "```diff\n".concat(str).concat("\n```");
  },
  orangeWrap(str) {
    return "```fix\n".concat(str).concat("\n```");
  },
  greenWrap(str) {
    return "```yaml\n".concat(str).concat("\n```");
  },
  lightGreenWrap(str) {
    return "```css\n".concat(str).concat("\n```");
  },
  successEmbed(embed, description) {
    embed
      .setColor("#00d166")
      .setAuthor("✅ Success")
      .setDescription(this.boldWrap(description));
  },
  errorEmbed(embed, description) {
    embed
      .setColor("#f8c300")
      .setAuthor("⚠️ Error")
      .setDescription(this.boldWrap(description));
  },
  cooldownEmbed(embed, description) {
    embed
      .setColor("#CC7900")
      .setAuthor("⏳ Cooldown")
      .setDescription(this.boldWrap(description));
  },
  permissionEmbed(embed, description) {
    embed
      .setColor("#A62019")
      .setAuthor("🚫 Permission")
      .setDescription(this.boldWrap(description));
  },
  cancelEmbed(embed, description) {
    embed
      .setColor("#A62019")
      .setAuthor("❌ Cancelled")
      .setDescription(this.boldWrap(description));
  },
};
