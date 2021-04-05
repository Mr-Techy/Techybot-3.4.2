const canvas = require("discord-canvas");

module.exports = async (bot, member) => {
  const guild = member.guild;
  const user = member.user;

  const image = new canvas.Welcome()
    .setUsername(user.username)
    .setDiscriminator(user.discriminator)
    .setMemberCount(guild.memberCount())
    .setGuildName(guild.name)
    .setAvatar(user.displayAvatarURL({ format: "png" }));
};
