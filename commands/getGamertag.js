const makeFetch=require("../messageManager/makeFetch");
const { SlashCommandBuilder } = require('@discordjs/builders');
const getGamertag = async (interaction)=>{
    let query = `query userId($slug:String){
      user(slug:$slug){
        player { 
          gamerTag        
        }      
      }
    }`;
    let variables = {
      slug:interaction.options.getString('slug')
    }
    
    makeFetch(query,variables)  
    .then((res)=>{
      let gamerTag = res.data.user.player.gamerTag
      interaction.reply({
        content: gamerTag
      })
       
    })
    .catch((e) => {
      interaction.reply({
        content: "Jugador no encontrado :c"
      })
    });
   
  }

  const data =  new SlashCommandBuilder()
  .setName('gamertag')
  .setDescription('Obten el gamertag de un jugador!')
  .addStringOption(option =>
    option.setName('slug')
      .setDescription('slug del jugador')
      .setRequired(true));


  module.exports = {
    data: data,
    async execute(interaction) {
      await getGamertag(interaction);
    },
  };