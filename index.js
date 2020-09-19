const fs = require('fs');
const Discord = require('discord.js');
const { defaultprefix, token, colour, activity, status } = require('./config.json');
const { MessageEmbed } = require('discord.js');
const webhookClient = new Discord.WebhookClient('', '');
const bot = new Discord.Client(); 
const client = new Discord.Client();

const guildConfig = require('./storage/guildConfig.json');
const guildchannels = require('./storage/guildChannels.json');
const botStats = require('./storage/botStats.json');

let large = {
	"true": "Yes",
	"false": "No"
}

let region = {   
	"eu-central": ":flag_eu: Central Europe",
	"singapore": ":flag_sg: Singapore",
	"us-central": ":flag_us: US Central",
	"sydney": ":flag_au: Sydney",
	"us-east": ":flag_us: US East",
	"us-south": ":flag_us: US South",
	"us-west": ":flag_us: US West",
	"eu-west": ":flag_eu: Western Europe",
	"vip-us-east": ":flag_us: VIP US East",
	"london": ":flag_gb: London",
	"amsterdam": ":flag_nl: Amsterdam",
	"hongkong": ":flag_hk: Hong Kong",
	"russia": ":flag_ru: Russia",
	"southafrica": ":flag_za:  South Africa",
	"europe": ":flag_eu:  Europe",
	"brazil": ":flag_br:  Brazil",
	"india": ":flag_in:  India",
	"japan": ":flag_jp:  Japan"
};

client.on('guildCreate', guild => {
	function checkDays(date) {
		let now = new Date();
		let diff = now.getTime() - date.getTime();
		let days = Math.floor(diff / 86400000);
		return days + (days == 1 ? " day" : " days") + " ago";
	};
	const webhookEmbed = new Discord.MessageEmbed()
		.setAuthor(`${guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(guild.createdAt)})`)
		.addField(`Server`, `${guild.name}`, true)
		.addField(`Members`, `${guild.memberCount}`, true)
		.addField(`Owner`, `${guild.owner.user.tag}`, true)
		.addField(`Owner ID`, `${guild.owner.user.id}`, true)
		.addField(`Region`, `${region[guild.region]}`, true)
		.setFooter(`ID: ${guild.id} | Made by Reversatile#2613`)
		.setThumbnail(`${guild.iconURL()}`)
		.setColor(`#4ACC85`)
	webhookClient.send('', {
		username: 'Guild Join',
		embeds: [webhookEmbed],
	});
	
	console.log(`Joined new guild: ${guild.name} \nTotal members: ${guild.memberCount}`);
	const name = guild.name

    if (!guildConfig[guild.id]) {
	guildConfig[guild.id] = {
		name: name,
		prefix: defaultprefix
	}
    }
     fs.writeFile('./storage/guildConfig.json', JSON.stringify(guildConfig, null, 2), (err) => {
     	if (err) console.log(err)
	})
	let fetch = require("node-fetch");
});

client.on('guildDelete', (guild) => {
	function checkDays(date) {
		let now = new Date();
		let diff = now.getTime() - date.getTime();
		let days = Math.floor(diff / 86400000);
		return days + (days == 1 ? " day" : " days") + " ago";
	};
	const webhookEmbed = new Discord.MessageEmbed()
		.setAuthor(`${guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(guild.createdAt)})`)
		.addField(`Server`, `${guild.name}`, true)
		.addField(`Members`, `${guild.memberCount}`, true)
		.addField(`Owner`, `${guild.owner.user.tag}`, true)
		.addField(`Owner ID`, `${guild.owner.user.id}`, true)
		.addField(`Region`, `${region[guild.region]}`, true)
		.setFooter(`ID: ${guild.id} | Made by Reversatile#2613`)
		.setThumbnail(`${guild.iconURL()}`)
		.setColor(`#da7272`)
	webhookClient.send('', {
		username: 'Guild Leave',
		embeds: [webhookEmbed],
	});
	console.log(`Left guild: ${guild.name} \nTotal members: ${guild.memberCount}`);
    delete guildConfig[guild.id];
    fs.writeFile('./storage/guildConfig.json', JSON.stringify(guildConfig, null, 2), (err) => {
    	if (err) console.log(err)
	})
	delete guildchannels[guild.id];
    fs.writeFile('./storage/guildChannels.json', JSON.stringify(guildchannels, null, 2), (err) => {
    	if (err) console.log(err)
	})
});



client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

const activitieslist = [
	activity.one
]; 

client.once('ready', async () => {
	const botname = client.user.username;
	var guildsize = client.guilds.cache.size.toLocaleString();
	var normalsize = bot.guilds.cache.size;
	var userssize = client.users.cache.size.toLocaleString();
	var shardsize = "1";
	console.log(`${botname} is now online in ${guildsize} guilds and serves ${userssize} users!`);
	let fetch = require("node-fetch");
	const webhookEmbed = new Discord.MessageEmbed()
		.addField(`Guilds`, `${guildsize}`, true)
		.addField(`Users`, `${userssize}`, true)
		.setFooter(`Made by Reversatile#2613)
		.setColor(colour)
	webhookClient.send('', {
		username: 'Bot Online',
		embeds: [webhookEmbed],
	});
	
	if (status.streaming == true) {
		client.user.setStatus(status.type);
		client.user.setActivity(activity, {
			type: "WATCHING",
			url: status.url
		});
	} else {
		client.user.setStatus(status.type);
		setInterval(() => {
			var guildsize = client.guilds.cache.size.toLocaleString();
			var channelsize = client.channels.cache.size.toLocaleString();
			var userssize = client.users.cache.size.toLocaleString();
			client.user.setActivity(`r.help | ${guildsize} servers`, {
				type: "WATCHING"
			});
			botStats['stats'] = {
				guilds: guildsize,
				channels: channelsize,
				users: userssize
			}
		
			fs.writeFile('./storage/botStats.json', JSON.stringify(botStats, null, 2), (err) => {
				if (err) console.log(err)
			})
		}, activity.delay);
	}
	
});

client.on('message', message => {
	if (message.content.toLowerCase().startsWith('<@!729719782617645087>') && !message.author.bot) {
		if (message.deletable) message.delete();
		
		if (message.channel.type == "dm") {
			return message.reply(`My global prefix is \`${defaultprefix}\``).then(msg => {
				msg.delete({ timeout: 5000 })
			})
				.catch(console.error);
		} else {
			var guild = message.guild
			var name = message.guild.name
			if (!guildConfig[guild.id]) {
				guildConfig[guild.id] = {
					name: name,
					prefix: defaultprefix
				}
			}
			if (!guildchannels[guild.id]) {
				guildchannels[guild.id] = {
					reports: "",
					suggestions: "",
					logs: ""
				}
			}
			var guild = message.guild
			var name = message.guild.name
			if (!guildConfig[guild.id]) {
				guildConfig[guild.id] = {
					name: name,
					prefix: defaultprefix
				}
			}
			fs.writeFile('./storage/guildConfig.json', JSON.stringify(guildConfig, null, 2), (err) => {
				if (err) console.log(err)
			   })
			fs.writeFile('./storage/guildChannels.json', JSON.stringify(guildchannels, null, 2), (err) => {
				if (err) console.log(err)
		   		})
			return message.reply(`the prefix for this server is \`${guildConfig[guild.id].prefix}\``).then(msg => {
				msg.delete({ timeout: 5000 })
			})
				.catch(console.error);
		}
	}

	if (message.content.toLowerCase().startsWith('r.docs') && message.author.id == "729719782617645087") {
		if (message.deletable) message.delete();
		const embed = new MessageEmbed()
			.setTitle(`ReportBot Documentation`)
			.setDescription(`Click [here](https://realreversatile.gitbook.io/reportbot/) to open the documentation`)
			.setColor(colour)
		message.channel.send(embed);
	}

	if (message.channel.type == "dm") {
		var prefix = defaultprefix
	} else {
		var guild = message.guild
		const name = message.guild.name
		if (!guildConfig[guild.id]) {
			guildConfig[guild.id] = {
				name: name,
				prefix: defaultprefix
			}
		}
		if (!guildchannels[guild.id]) {
			guildchannels[guild.id] = {
				reports: "",
				suggestions: "",
				logs: ""
			}
		}
		fs.writeFile('./storage/guildConfig.json', JSON.stringify(guildConfig, null, 2), (err) => {
			if (err) console.log(err)
		   })
		fs.writeFile('./storage/guildChannels.json', JSON.stringify(guildchannels, null, 2), (err) => {
			if (err) console.log(err)
			   })
		var prefix = guildConfig[guild.id].prefix
	}
	
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		if (message.deletable) message.delete();
		const noDM = new MessageEmbed()
			.setTitle(`Error`)
			.setColor(colour)
			.setTimestamp()
			.setDescription(`I can't execute that command inside DMs`)
			.setFooter(`Made by Reversatile#2613`)
		message.author.send(noDM);
	}

	if (command.args && !args.length) {
		if (message.deletable) message.delete();
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
			.then(msg => {
				msg.delete({ timeout: 5000 })
			})
			  .catch(console.error);
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			if (message.deletable) message.delete();
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`a little too quick there.`)
			.then(msg => {
				msg.delete({ timeout: 2000 })
			})
			  .catch(console.error);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args, client);
	} catch (error) {
		console.error(error);
		if (message.deletable) message.delete();
		const noDM = new MessageEmbed()
			.setTitle(`Error`)
			.setColor(colour)
			.setTimestamp()
			.setDescription(`There was an error trying to execute that command!\nIf you speak to support, send this error message \n\`\`\`${error}\`\`\``)
			.addField(`Support server`, `https://discord.gg/rVqn8z4`)
			.setFooter(`Made by Reversatile#2613`)
		message.author.send(noDM)
			.then(msg => {
				msg.delete({ timeout: 60000 })
			})
			.catch(console.error);
	}

	
});

client.login(token);
