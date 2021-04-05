const { Collection, Client, MessageEmbed } = require("discord.js");
const keepAlive = require("./server");
const fs = require("fs");
const ms = require("ms");
const bot = new Client({
  disableEveryone: true,
  partials: ["MESSAGE", "CHANNEL", "REACTION"]
});
const { token } = require("./config");
const fetch = require("node-fetch");
const db = require("quick.db");

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://MrTechy:valtaoi12@techybot-v3.uzjqd.mongodb.net/Data",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  )
  .then(console.log("Connected to Mongo.db!"));

const distube = require("distube");
const player = new distube(bot);

/**
 * player.on('playSong', (message, queue, song) => {
	message.channel.send(
		new MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setColor('BLUE')
			.setDescription(`**Search query:** ${song}\n**Song name:** ${song.name}`)
			.setTimestamp()
	)
});
 */

module.exports.bot = bot;

bot.player = player;
bot.cooldown = new Collection();
bot.ticketCategory = "814615460976918541";
bot.prefix = "-";
bot.token = token;
bot.people = db.get(`people`);
bot.owner = bot.users.cache.find(m => m.tag == "Mr. Techy#0077");
bot.website = "https://techybot.mrtechy11.repl.co/";
bot.commands = new Collection();
bot.aliases = new Collection();
bot.categories = fs.readdirSync("./commands/");
["command", "event"].forEach(handler => {
  require(`./handlers/${handler}`)(bot);
});

bot.on("ready", () => {
  console.log(`${bot.user.tag} has logged in.`);
});

let index = 0;

setInterval(async () => {
  let array = [
    `${db.get(`botpeople.number`)} users`,
    `-help for help`,
    `over the Discraft Empire`,
    `Mr. Techy code`
  ];

  if (index >= array.length) index = 0;

  await bot.user.setPresence({
    activity: {
      name: array[index],
      type: "WATCHING"
    },
    status: "idle"
  });

  index++;
}, 10000);

setInterval(async () => {
  await fetch(bot.website).then(async () => {
    bot.channels.cache
      .find(ch => ch.name.includes(`techybot-uptime-logs`))
      .send(`Pinged website.`);
  });
}, 300000);

setInterval(async () => {
  bot.channels.cache
    .get("815966956892061746")
    .send("Testing message for uptime, don't mind me.");
}, 600000);

let offlineIndex = 1;

while (offlineIndex != 0) {
  db.delete(`last-uptime`);
  db.set(`last-uptime`, Date.now());

  setTimeout(() => {
    offlineIndex++;
  }, 5000);
}

keepAlive(8080 || 8081 || 3000 || 3001);

bot.login(token);
