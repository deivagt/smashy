const util = require('util');
import { makeFetch } from "./makeFetch";
let swtLocalPlayersData: {[index: string]:any} = {
    date:"1",
    players:{},

}
const getSwtPoints = async (message:any, slug:string)=>{
    slug= "user/"+slug;
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
    do{
    //console.log(page);
        let variables = {
            slug:"league/swt-ultimate-2022",
            page:page
          };
        page++;

        await makeFetch(query,variables)  
        .then((res)=>{
          let allPlayers = res.data.league.standings.nodes;

          //console.log(allPlayers[0]);

          if(allPlayers[0] === undefined){
              console.log("y nos salimos");
            continueFetch = false;
          }
          for(let i = 0; i <150;i++){
           let playerData = allPlayers[i];
           if(playerData===undefined){
      
           }else{
               let newPlayer:any = 'player'+(desfase+i);
            swtLocalPlayersData.players[newPlayer]= playerData;
           }
          }
          desfase +=149; //Incrementa el desfase para seguir jalando data
           
        })
        .catch((e) => {
          console.log(e);
          message.reply({
            content: "No hay informacion :c"
          })
        });
        
        
    }while(continueFetch);

    console.log(util.inspect(swtLocalPlayersData, false, null, true /* enable colors */));
    message.reply({
        content: "probando"
      })
  } ;
  
  
export{getSwtPoints};