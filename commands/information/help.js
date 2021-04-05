const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const prefix = require("../../config.json").prefix;

module.exports = {
	name: "help",
	aliases: ['h'],
	description: "Shows all available bot commands.",
	cooldown: 1000,
	run: async (bot, message, args) => {
		const roleColor =
			message.guild.me.displayHexColor === "#000000"
				? "#ffffff"
				: message.guild.me.displayHexColor;
		
		if (!args[0]) {
			let categories = [];

			const dirEmojis = {
				information: "",
				fun: "",
				economy: "",
				leveling: "",
				moderation: "",
				utility: "",
			};

			readdirSync("./commands/").forEach((dir) => {
				let editedName = `${dirEmojis[dir]} ${dir.toUpperCase()}`;
				if (!editedName[dir]) editedName = dir.toUpperCase();
				const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));

				const cmds = commands.filter((command) => {
					let file = require(`../../commands/${dir}/${command}`);

					return !file.hidden;
				}).map((command) => {
					let file = require(`../../commands/${dir}/${command}`);

					if (!file.name) return "No command name.";

					let name = file.name.replace(".js", "");

					return `\`${name}\``;
				});

				let data = new Object();

				data = {
					name: editedName,
					value: cmds.length === 0 ? "In progress." : cmds.join(" "),
				};

				categories.push(data);
			});

			const embed = new MessageEmbed()
				.setTitle("📬 Need help? Here are all of my commands:")
				.addFields(categories)
				.setDescription(
					`Use \`${prefix}help\` followed by a command name to get more additional information on a command. For example: \`${prefix}help ban\`.`
				)
				.setFooter(
					`Requested by ${message.author.tag}`,
					message.author.displayAvatarURL({ dynamic: true })
				)
				.setTimestamp()
				.setColor(roleColor);
			return message.channel.send(embed);
		} else {
			const command =
				bot.commands.get(args[0].toLowerCase()) ||
				bot.commands.find(
					(c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
				);

			if (!command) {
				const embed = new MessageEmbed()
					.setTitle(`That command does not exist.`)
					.setColor("FF0000");
				return message.channel.send(embed);
			}

			if (command.hidden) {
				const embed = new MessageEmbed()
					.setTitle(`That command is not intended for you.`)
					.setColor("FF0000");
				return message.channel.send(embed);
			}

			if (command.ownerOnly) {
				const embed = new MessageEmbed()
					.setTitle(`That command is not intended for you.`)
					.setColor("FF0000");
				return message.channel.send(embed);
			}

			const embed = new MessageEmbed()
				.setTitle("Command Details:")
				.addField("PREFIX:", `\`${prefix}\``)
				.addField(
					"COMMAND:",
					command.name ? `\`${command.name}\`` : "No name for this command."
				)
				.addField(
					"ALIASES:",
					command.aliases
						? `\`${command.aliases.join("` `")}\``
						: "No aliases for this command."
				)
				.addField(
					"USAGE:",
					command.usage
						? `\`${prefix}${command.name} ${command.usage}\``
						: `\`${prefix}${command.name}\``
				)
				.addField(
					"DESCRIPTION:",
					command.description
						? command.description
						: "No description for this command."
				)
				.setFooter(
					`Requested by ${message.author.tag}`,
					message.author.displayAvatarURL({ dynamic: true })
				)
				.setFooter('For usage: arguments in [brackets] are required, arguments in (parentheses) are optional.')
				.setTimestamp()
				.setColor(roleColor);
			message.channel.send(embed);
		}

		bot.cooldown.set(`help${message.author.id}`, Date.now() + 1000);
	},
};
