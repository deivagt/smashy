const makeFetch=require("../messageManager/makeFetch");
const { SlashCommandBuilder } = require('@discordjs/builders');
const smashGameCode = 1386;
const getUpcomingTournament = async(interaction)=>{
    let query = `query TournamentsByVideogame( $videogameId: ID, $countryCode: String) {
      tournaments(query: {
        perPage: 10
        page: 1
        sortBy: "state asc"
        filter: {
          countryCode: $countryCode
          upcoming: true
          videogameIds: [
            $videogameId
          ]
        }
      }) {
        nodes {
          name    
        }
      }
    }`;
    let countryCode = interaction.options.getString('countrycode').toUpperCase();
    let variables = {
      videogameId: smashGameCode,
      countryCode:countryCode
    };
    makeFetch(query,variables)  
    .then((res)=>{
  
      let msg = "No se han encontrado torneos :c";
      let primero = true;
      for(let i = 0; i <11;i++){
       let tourneyData = res.data.tournaments.nodes[i];
       if(tourneyData !== undefined){
        if(primero == true){
          msg = "";
         primero =  false;
         }
         msg +="#" +(i+1) + " - " + tourneyData.name + "\n";
       }
      
      }
      
      interaction.reply({
        content: msg
      });
      
       
    })
    .catch((e) => {
      interaction.reply({
        content: "No se han encontrado torneos :c"
      })
    });
   
  }
  const data =  new SlashCommandBuilder()
  .setName('upcoming')
  .setDescription('Obten los proximos torneos de tu pais!')
  .addStringOption(option =>
    option.setName('countrycode')
      .setDescription('Codigo de pais. ejemplo: "gt"')
      .setRequired(true));


  module.exports = {
    data: data,
    async execute(interaction) {
      await getUpcomingTournament(interaction);
    },
  };