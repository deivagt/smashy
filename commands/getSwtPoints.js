const util = require('util');
const makeFetch=require("../messageManager/makeFetch");
const { SlashCommandBuilder } = require('@discordjs/builders');
let swtLocalPlayersData = {
    players: []
}
const getSwtPoints = async (interaction) => {

    let query =
`query entrantsAllSWT($slug:String, $page:Int ){
  league(slug:$slug){
      standings(query:{page:$page, perPage:150}
      ){
        nodes{
          entrant{
            name              
          }
          player{
            user{
              slug
            }
          }              
          placement
          totalPoints            
        }
      }
  }
}`;
let page = 1;
let desfase = 0;
let continueFetch = true;

let dontQuery = false;
 if(swtLocalPlayersData["LastQuery"] !== undefined){
     //console.log("no va a hacer el query")
     let actualDate = new Date();
     let diffTime = actualDate.getTime() - swtLocalPlayersData["LastQuery"].getTime();
     let resultInMinutes = Math.round(diffTime / 60000);
     if(resultInMinutes < 10){
         dontQuery = true;
     }
 }

do {
    //console.log(page);
    if(dontQuery == true){
        break;
    }
    let variables = {
        slug: "league/swt-ultimate-2022",
        page: page
    };
    page++;

    await makeFetch(query, variables)
        .then((res) => {
            let allPlayers = res.data.league.standings.nodes;

            if (allPlayers[0] === undefined) {
                continueFetch = false;
            }
            for (let i = 0; i < 150; i++) {
                let playerData = allPlayers[i];
                if (playerData === undefined) {

                } else {
                    let newPlayer = 'player' + (desfase + i);
                    swtLocalPlayersData.players[newPlayer] = playerData;
                }
            }
            desfase += 149; //Incrementa el desfase para seguir jalando data
            //Save the last query time
            swtLocalPlayersData["LastQuery"] = new Date();
        })
        .catch((e) => {
            console.log(e);
        });


} while (continueFetch);

   
    let slug = "user/" + interaction.options.getString('slug');

    let response = "No hay data disponible";
    let resState = false;

    for (let i in swtLocalPlayersData.players) {
        let playerData = swtLocalPlayersData.players[i];
        //console.log(playerData)
        if (playerData.player.user !== null && playerData.player.user.slug == slug) {
            response =
`
Jugador: ${playerData.entrant.name}
Posicion: ${playerData.placement}
Puntuacion: ${playerData.totalPoints}
`;

    resState = true;
        }
    }

   
    if(resState){
      
        interaction.editReply({
          content: response
      });
    }else{
        getPlayerData(interaction);
    }
    
};

const getPlayerData = async (interaction)=>{
    let query = `query userId($slug:String){
      user(slug:$slug){
        player { 
            prefix
            gamerTag        
        }      
      }
    }`;
    let variables = {
      slug:interaction.options.getString('slug')
    }
    await makeFetch(query,variables)  
    .then((res)=>{
      let playerData = res.data.user.player
      let msg =
      `
Jugador:  ${playerData.gamerTag}
Posicion: ?
Puntuacion: 0
`;
interaction.editReply({
        content: msg
      })
       
    })
    .catch((e) => {
      interaction.editReply({
        content: "Jugador no encontrado :c"
    });
      
    });   
  }

  const data =  new SlashCommandBuilder()
  .setName('swtpts')
  .setDescription('Obten tus puntos del Smash World Tour!')
  .addStringOption(option =>
    option.setName('slug')
      .setDescription('slug del jugador')
      .setRequired(true));


  module.exports = {
    data: data,
    async execute(interaction) {

      await interaction.reply('Buscando...');
      await getSwtPoints(interaction);

      
    },
  };