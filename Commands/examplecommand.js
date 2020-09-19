const { MessageEmbed } = require('discord.js');
const { colour } = require('../config.json');

module.exports = {
	name: 'example',
	description: 'An example of a command for ReportBot',
	aliases: ['exmp'],
	type: "Public",
	usage: '',
	guildOnly: false,
	cooldown: 5,
	execute(message) {
		if (message.deletable) message.delete();
		const embed = new MessageEmbed()
			.setTitle(`ReportBot`)
			.setDescription(`This is an example command, click [here](https://discord.gg/DCarZHg) to join the ReportBot support server`)
			.setColor(colour)
		message.channel.send(embed);
	},
};
