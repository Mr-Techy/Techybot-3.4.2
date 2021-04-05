const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "user-roles",
  description: "Displays the user's roles.",
  aliases: ["users-roles"],
  run: async (bot, message, args) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send(`You must mention a member.`);

    const memberRoles = member.roles.cache
      .filter(roles => roles.id !== message.guild.id)
      .map(role => role.toString());

    const embed = new MessageEmbed()
      .setAuthor(
        member.user.tag,
        member.user.displayAvatarURL({ dynamic: true })
      )
      .setDescription(memberRoles)
      .setColor("BLUE")
      .setTimestamp();

    message.channel.send(embed);
  }
};
