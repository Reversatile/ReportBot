const { MessageEmbed } = require('discord.js');
const { colour } = require('../config.json');

module.exports = {
	name: 'documentation',
	description: 'Get the documentation for the bot',
	aliases: ['docs'],
	type: "Public",
	usage: '',
	guildOnly: false,
	cooldown: 5,
	execute(message) {
		if (message.deletable) message.delete();
		const embed = new MessageEmbed()
			.setTitle(`ReportBot Documentation`)
			.setDescription(`Click [here](https://realreversatile.gitbook.io/reportbot/) to open the documentation`)
			.setColor(colour)
		message.channel.send(embed);
	},
};
