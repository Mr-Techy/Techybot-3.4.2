const db = require("quick.db");

module.exports = (bot, message) => {
  // COUNTING
  if (message.channel.name != "counting") return;
  if (message.author.bot) return;

  if (!db.get(`count`))
    db.set(`count`, {
      number: 0,
      lastPerson: bot.id
    });

  if (message.content != db.get(`count.number`)) return message.delete();
  if (message.author.id == db.get(`count.lastPerson`)) return message.delete();

  db.add(`count.number`, 1);
  db.set(`count.lastPerson`, message.author.id);
};
