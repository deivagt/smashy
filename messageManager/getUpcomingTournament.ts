import { makeFetch } from "./makeFetch";
const smashGameCode = 1386;
const getUpcomingTournament = (message:any,countryCode:string)=>{
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
    countryCode = countryCode.toUpperCase();
    let variables = {
      videogameId: smashGameCode,
      countryCode:countryCode
    };
    makeFetch(query,variables)  
    .then((res)=>{
  
      let msg = "";
      for(let i = 0; i <11;i++){
       let tourneyData = res.data.tournaments.nodes[i];
       if(tourneyData === undefined){
        continue;
       }
       msg +="#" +(i+1) + " - " + tourneyData.name + "\n";
      }
  
      message.reply({
        content: msg
      });
      
       
    })
    .catch((e) => {
      message.reply({
        content: "No se han encontrado torneos :c"
      })
    });
   
  }
  export{getUpcomingTournament};