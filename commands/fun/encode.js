const axios = require("axios");

module.exports = {
  name: "encode",
  description: "Encodes text into binary.",
  aliases: ["binary-encode"],
  usage: "[text to encode]",
  run: async (bot, message, args) => {
    const text = args.join(" ");

    if (!text)
      return message.channel.send(`You must state some text to encode.`);

    const { data } = await axios.get(
      `https://some-random-api.ml/binary?text=${text}`
    );

    message.channel.send(data.binary);
  }
};
