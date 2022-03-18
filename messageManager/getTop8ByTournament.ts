import { makeFetch } from "./makeFetch";
const getTop8ByTournament = (message:any,tournametSlug:string) =>{
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
    
    let variables = {
      slug:tournametSlug
    };
    makeFetch(query,variables)  
    .then((res)=>{
      let msg = "";
      for(let i = 0; i <8;i++){
       let playerData = res.data.tournament.events[0].standings.nodes[i];
       if(playerData===undefined){
  
      }else{
        msg +="#" +playerData.placement + " - " + playerData.entrant.name + "\n";
      }
      
      }
  
      message.reply({
        content: msg
      })
       
    })
    .catch((e) => {
      message.reply({
        content: "Torneo no encontrado :c"
      })
    });
    ;
  }
  export {getTop8ByTournament};