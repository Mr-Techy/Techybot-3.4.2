const db = require("quick.db");
const ms = require("ms");

module.exports = async bot => {
  const time = await db.get(`last-uptime`);

  if (Date.now() - time > 7500) {
    bot.channels.cache
      .get("815966956892061746")
      .send(
        `I was offline for **${ms(Date.now() - time, {
          long: true
        })}** <@795717413337432064> <@748569374079713453>`
      );
  }
};
