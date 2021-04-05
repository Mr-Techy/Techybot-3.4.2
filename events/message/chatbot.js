const alexa = require("alexa-bot-api");
const chatbot = new alexa("");

module.exports = (bot, message) => {
  // CHATBOT AI
  if (message.author.bot) return;
  if (message.channel.id != "813077093000413184") return;

  const args = message.content
    .slice(bot.prefix.length)
    .trim()
    .split(/ +/);
  const q = args.join(" ");

  if (!q) return message.channel.send("You must ask me a question.");

  message.channel.startTyping();

  chatbot.getReply(q).then(r => {
    message.reply(r);
    message.channel.stopTyping(true);
  });
};
