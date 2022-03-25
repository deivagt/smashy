
const dotenv= require("dotenv") ;
dotenv.config();

//Cosas de discord 
const { Client, Intents,Collection } = require('discord.js');
const fs = require('node:fs');


const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

//funcion para notificar el estado del bot
client.once("ready", () => {  
  console.log("Bot funcionando");
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Ocurrio un error al ejecutar el comando!', ephemeral: true });
	}
});


//funcion para hacer funcionar el bot
client.login(process.env.TOKEN);


