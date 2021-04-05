const axios = require("axios");

module.exports = {
  name: "fact",
  description: "Sends a random fact.",
  aliases: ["random-fact", "random-facts", "facts"],
  run: async (bot, message, args) => {
    let { data } = await axios.get(
      `https://uselessfacts.jsph.pl/random.json?language=en`
    );

    let editedText = data.text;

    if (editedText.includes("`")) {
      while (editedText.includes("`")) {
        editedText = editedText.replace("`", "'");
      }
    }

    message.channel.send(editedText);
  }
};
