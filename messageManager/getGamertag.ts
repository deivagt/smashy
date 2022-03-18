import { makeFetch } from "./makeFetch";
const getGamertag = (message:any,playerSlug:string)=>{
    let query = `query userId($slug:String){
      user(slug:$slug){
        player { 
          gamerTag        
        }      
      }
    }`;
    let variables = {
      slug:playerSlug
    }
    makeFetch(query,variables)  
    .then((res)=>{
      let gamerTag = res.data.user.player.gamerTag
      message.reply({
        content: gamerTag
      })
       
    })
    .catch((e) => {
      message.reply({
        content: "Jugador no encontrado :c"
      })
    });
   
  }
export {getGamertag};