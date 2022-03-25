const makeFetch=require("../messageManager/makeFetch");
const { SlashCommandBuilder } = require('@discordjs/builders');


const showHelp = async (interaction) =>{
    let msg = 
`
Comandos disponibles: 
/gamertag - Devuelve el gamertag del usuario
/top - Devuelve el top 8 del torneo indicado
/upcoming - Devuelve proximos torneos del pais indicado
/swttop - Devuelve el top 20 del Smash World Tournament actual
/swtpts - Devuelve los puntos de un jugador del Smash World Tournament actual
`;


interaction.reply({
    content: msg
  });
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Obten ayuda de los comandos!'),
	async execute(interaction) {
		await showHelp(interaction);
	},
};