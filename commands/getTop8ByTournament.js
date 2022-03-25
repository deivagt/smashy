const makeFetch=require("../messageManager/makeFetch");
const { SlashCommandBuilder } = require('@discordjs/builders');
const getTop8ByTournament = async(interaction) =>{
    let query =
    `query entrants($slug:String ){
      tournament(slug:$slug){
        events{
          standings(query:{}
          ){
            nodes{
            entrant{
              name
            }
              placement
            }
          }
        }
      }
    }`
    ;
    let tournamenSlug = interaction.options.getString('tournamentslug');
    tournamenSlug = clearSlug(tournamenSlug);
    

    let variables = {
      slug:tournamenSlug
    };
    makeFetch(query,variables)  
    .then((res)=>{
      let msg = "Torneo no encontrado :c";
      let primero = true;
      for(let i = 0; i <8;i++){
       let playerData = res.data.tournament.events[0].standings.nodes[i];
       if(playerData!==undefined){
        if(primero == true){
          msg = "";
         primero =  false;
         }
          msg +="#" +playerData.placement + " - " + playerData.entrant.name + "\n";
      }
      
      }
  
      interaction.reply({
        content: msg
      })
       
    })
    .catch((e) => {
      interaction.reply({
        content: "Torneo no encontrado :c"
      })
    });
    ;
  }



  const clearSlug =(tournamentSlug)=>{
  
    let cleanSlug = tournamentSlug.replace(/[^0-9a-z-A-Z ]/g,'')
    cleanSlug = cleanSlug.replace(/ /g,'-');
    cleanSlug = "tournament/"+cleanSlug;
    return cleanSlug;
  
    
  };

  
  const data =  new SlashCommandBuilder()
  .setName('top')
  .setDescription('Obten el top 8 de un torneo!')
  .addStringOption(option =>
    option.setName('tournamentslug')
      .setDescription('Nombre del torneo')
      .setRequired(true));


  module.exports = {
    data: data,
    async execute(interaction) {
      await getTop8ByTournament(interaction);
    },
  };