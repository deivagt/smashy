const makeFetch=require("../messageManager/makeFetch");
const { SlashCommandBuilder } = require('@discordjs/builders');
const getTop20SWT = async(interaction ) =>
{
  //league/swt-ultimate-2022
  let query =
  `query entrantsSWT($slug:String ){
    league(slug:$slug){
    name
        standings(query:{}
        ){
          nodes{
            entrant{
              name
            }            
            placement
            totalPoints
          }
        }
    }
  }`
  ;
  
  let variables = {
    slug: "league/swt-ultimate-2022"
  };
  makeFetch(query,variables)  
  .then((res)=>{
    let msg = "No hay informacion :c";
    let primero = true;
    for(let i = 0; i <20;i++){
     let playerData = res.data.league.standings.nodes[i];
     if(playerData!==undefined){
       if(primero == true){
         msg = "";
        primero =  false;
        }
      msg +="#" +playerData.placement +  " - Pts. "+ playerData.totalPoints+ " - " + playerData.entrant.name +"\n";
     }
     
    }

    interaction.reply({
      content: msg
    })
     
  })
  .catch((e) => {
    console.log(e);
    interaction.reply({
      content: "No hay informacion :c"
    })
  });
  ;
}



module.exports = {
	data: new SlashCommandBuilder()
		.setName('swttop')
		.setDescription('Obten el top 20 del Smash World Tour!'),
	async execute(interaction) {
		await getTop20SWT(interaction);
	},
};