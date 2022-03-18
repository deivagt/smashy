const util = require('util');
import { makeFetch } from "./makeFetch";
let swtLocalPlayersData: { [index: string]: any } = {
    players: [],
    //lastQuery

}
const getSwtPoints = async (message: any, slug: string) => {

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

            //console.log(allPlayers[0]);

            if (allPlayers[0] === undefined) {
                console.log("y nos salimos");
                continueFetch = false;
            }
            for (let i = 0; i < 150; i++) {
                let playerData = allPlayers[i];
                if (playerData === undefined) {

                } else {
                    let newPlayer: any = 'player' + (desfase + i);
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


    slug = "user/" + slug;    

    //console.log(util.inspect(swtLocalPlayersData, false, null, true /* enable colors */));
    let response = "No hay data disponible";
    let resState = false;
    //console.log(swtLocalPlayersData);
    for (let i in swtLocalPlayersData.players) {
        let playerData = swtLocalPlayersData.players[i];
        if (playerData.player.user.slug == slug) {
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
        message.reply({
            content: response
        })
    }else{
        getPlayerData(message,slug);
    }
    
};

const getPlayerData = (message:any,playerSlug:string)=>{
    let query = `query userId($slug:String){
      user(slug:$slug){
        player { 
            prefix
            gamerTag        
        }      
      }
    }`;
    let variables = {
      slug:playerSlug
    }
    makeFetch(query,variables)  
    .then((res)=>{
      let playerData = res.data.user.player
      let msg =
      `
Jugador:  ${playerData.gamerTag}
Posicion: ?
Puntuacion: 0
`
;
      message.reply({
        content: msg
      })
       
    })
    .catch((e) => {
      message.reply({
        content: "Jugador no encontrado :c"
      })
    });
   
  }

export { getSwtPoints };