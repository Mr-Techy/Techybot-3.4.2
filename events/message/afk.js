const db = require("quick.db");

module.exports = (bot, message) => {
  if (message.author.bot) return;

  if (message.mentions.users) {
    message.mentions.users.forEach(mention => {
      if (mention.toString() == "@everyone" || mention.toString() == "@here")
        return;
      if (db.get(`afks.${message.author.id}`)) {
        message.reply(
          `That member is AFK. \`${db.get(
            `afks.${message.author.id}.reason`
          )}\`.`
        );
      }
    });
  }

  if (db.get(`afks.${message.author.id}`)) {
    db.delete(`afks.${message.author.id}`);
    message.channel.send(
      `Welcome back ${message.author}! I have deleted your AFK.`
    );
  }
};
