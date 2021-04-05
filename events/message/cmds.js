const ms = require("ms");
const db = require("quick.db");
const canvacord = require("canvacord");
const canvas = require("discord-canvas");
const Discord = require("discord.js");
const got = require("got");
const moment = require("moment");
const fetch = require("node-fetch");
const novelcovid = require("novelcovid");
const randomstring = require("randomstring");
const reconlx = require("reconlx");

module.exports = async (bot, message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(bot.prefix)) return;
  if (!message.member)
    message.member = await message.guild.members.cache.get(message.author.id);

  const args = message.content
    .slice(bot.prefix.length)
    .trim()
    .split(/ +/);
  const cmd = args.shift().toLowerCase();

  if (cmd.length == 0) return;

  if (db.get(`cc.${message.guild.id}.${cmd}`)) {
    await eval(db.get(`cc.${message.guild.id}.${cmd}.response`)).catch(err => {
      message.channel.send(
        `There was an error executing the ${cmd} command. Error: \`${err}\``
      );
    });
  }

  let command = bot.commands.get(cmd);
  if (!command) command = bot.commands.get(bot.aliases.get(cmd));

  try {
    if (command) {
      if (command.cooldown) {
        if (bot.cooldown.has(`${command.name}${message.author.id}`))
          return message.channel.send(
            `You must wait \`${ms(
              bot.cooldown.get(`${command.name}${message.author.id}`) -
                Date.now(),
              { long: true }
            )}\` before you can use the ${command.name} command again.`
          );

        if (command.ownerOnly) {
          if (message.author.id != bot.owner.id)
            return message.channel.send(
              `Only ${bot.owner.tag} can use this command.`
            );
        }

        if (command.permissions) {
          command.permissions.forEach(permission => {
            if (!message.member.hasPermission(permission))
              return message.channel.send(
                `You need the \`${
                  command.permissions
                }\` permission to use the \`${cmd}\` command.`
              );
          });
        }

        if (db.get(`commands-status.${cmd}`))
          return message.channel.send(
            "This command has been disabled. Please contact an admin for further information."
          );

        command.run(bot, message, args);

        if (!db.get(`botpeople`))
          db.set(`botpeople`, {
            number: 0,
            people: []
          });

        if (!db.get(`botpeople.people`).includes(message.author.id)) {
          db.push(`botpeople.people`, message.author.id);
          db.add(`botpeople.number`, 1);
        }

        setTimeout(() => {
          bot.cooldown.delete(`${command.name}${message.author.id}`);
        }, command.cooldown);
      } else {
        if (command.permissions) {
          if (!message.member.hasPermission(command.permissions))
            return message.channel.send(
              `You need the \`${
                command.permissions
              }\` permission to use the \`${cmd}\` command.`
            );
        }

        if (command.ownerOnly) {
          if (message.author.id != bot.owner.id)
            return message.channel.send(
              `Only ${bot.owner.tag} can use this command.`
            );
        }

        if (db.get(`commands-status.${cmd}`))
          return message.channel.send(
            "This command has been disabled. Please contact an admin for further information."
          );

        command.run(bot, message, args);
      }
    } else return;
  } catch (err) {
    console.error(err);
    message.channel.send(
      `There was an error executing the ${cmd} command. Error: \`${err}\``
    );
  }
};
