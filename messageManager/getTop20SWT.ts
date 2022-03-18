import { makeFetch } from "./makeFetch";
const getTop20SWT = (message:any,slug:string ) =>
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
    slug:slug
  };
  makeFetch(query,variables)  
  .then((res)=>{
    let msg = "";
    
    for(let i = 0; i <20;i++){
     let playerData = res.data.league.standings.nodes[i];
     if(playerData===undefined){

     }else{
      msg +="#" +playerData.placement +  " - Pts. "+ playerData.totalPoints+ " - " + playerData.entrant.name +"\n";
     }
     
    }

    message.reply({
      content: msg
    })
     
  })
  .catch((e) => {
    console.log(e);
    message.reply({
      content: "No hay informacion :c"
    })
  });
  ;
}

export {getTop20SWT};