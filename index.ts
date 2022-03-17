import DiscordJS, { Intents, Message } from "discord.js";
import fetch from "node-fetch";
import dotenv from "dotenv";

const util = require('util');

dotenv.config();

const client = new DiscordJS.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
//funcion para notificar el estado del bot
client.on("ready", () => {
  console.log("Bot funcionando");
});

client.on("messageCreate", (message) => {
  //largo del comando gamertag
  let gamertagLenght = 9;
  //separar comando del mensaje
  let prefix = message.content.substring(0,1);
  let command = message.content.substring(1,gamertagLenght);
  command = command.toLowerCase();
  if(prefix==="!"){
    if (command === "gamertag") {

      //Separar slug del mensaje
      let playerSlug = message.content.substring(gamertagLenght+1, message.content.length);
      getGamertag(message,playerSlug);
      
     
    }else if(command === "help"){
      message.reply({
        content: 
        `Comandos disponibles: 
          !gamertag [slug] - Devuelve el gamertag del usuario
        
        `,
      })
    }
    else{
      message.reply({
        content: "No entiendo 0te",
      })
    }
  }
  
});
//funcion para hacer funcionar el bot
client.login(process.env.TOKEN);

const urlApi = "https://api.smash.gg/gql/alpha";



  const queryTop8TournamentOneEvent = `
  `




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
     
  });
 
}

const getTop8ByTournament = (message:any,tournametSlug:string) =>{
  let query =
  `
  query entrants($slug:String ){
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
  }
  `
  let variables = {
    slug:tournametSlug
  }
  makeFetch(query,variables)  
  .then((res)=>{
    let gamerTag = res.data.user.player.gamerTag
    message.reply({
      content: gamerTag
    })
     
  });
  ;
}


 const makeFetch = (query:string, variables:any)=>
  fetch(urlApi, 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.smashggToken}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }
    
    )
    .then((r) => r.json())
    .then((data) =>{ return data});




