module.exports = {
	name: "emoji.id",
	description: "Gives the ID of an emoji.",
	aliases: ['emoji-id'],
	run: async (bot, message, args) => {
		let emojiName = args.join(' ');
		if (!emojiName) return message.channel.send(`You must state the emoji\'s name.`);

		let emoji = await message.guild.emojis.cache.find(e => e.name == emojiName);
		if (!emoji) return message.channel.send(`I could not find that emoji.`);

		message.channel.send(`${emojiName}\'s emoji ID is \`${emoji.id}\`.`);
	}
}