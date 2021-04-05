const axios = require('axios');

module.exports = {
	name: 'decode',
	description: 'Decodes binary into text.',
	aliases: ['binary-decode'],
	usage: '[binary to decode]',
	run: async (bot, message, args) => {
		const binary = args.join(' ');

		if (!binary) return message.channel.send(`You must state some text to decode.`);

		const { data } = await axios.get(`https://some-random-api.ml/binary?decode=${binary}`);

		let response = data.text;

		if (response.includes('%20')) {
			while (response.includes('%20')) {
				response = response.replace('%20', ' ');
			};
		};

		message.channel.send(response);
	}
}