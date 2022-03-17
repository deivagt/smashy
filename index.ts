import DiscordJS, { Intents, Message } from "discord.js";
import fetch from "node-fetch";
import dotenv from "dotenv";

const util = require('util');


dotenv.config();

const urlApi = "https://api.smash.gg/gql/alpha";
const smashGameCode = 1386;

const client = new DiscordJS.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
//funcion para notificar el estado del bot
client.on("ready", () => {
  console.log("Bot funcionando");
});

client.on("messageCreate", (message) => {
  
  //separar comando del mensaje
  message.content = message.content.toLowerCase();

  let prefix = message.content.substring(0,1);
  let command = "";
  let parameter = "";
  if(message.content.indexOf(' ') >= 0){
    command =message.content.substring(0, message.content.indexOf(' '));
    command = command.replace('!','');
    parameter =message.content.substring( message.content.indexOf(' ')+1);
  }else{
    command = message.content;
    command = command.replace('!','');
  }
  

  if(prefix==="!"){
   console.log(command);
    if ( command=== "gamertag") {

      //Separar slug del mensaje
      let playerSlug = parameter;
      getGamertag(message,playerSlug);
      
    }

    else if(command === "top8"){
      let cleanSlug = clearSlug(parameter);
      cleanSlug = cleanSlug.replace(/ /g,'-');
      let finalSlug = "tournament/"+cleanSlug;
      getTop8ByTournament(message,finalSlug);
    } 
    else if(command === "upcoming"){
     
      getUpcomingTournament(message,parameter);
    } 
    else if(command=== "help"){
      message.reply({
        content: 
        `Comandos disponibles: 
          !gamertag [slug] - Devuelve el gamertag del usuario
          !top8 [slugTorneo] - Devuelve el top 8 del torneo indicado
          !upcoming [countryCode] - Devuelve proximos torneos del pais indicado
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
     msg +="#" +playerData.placement + " - " + playerData.entrant.name + "\n";
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




  //Funcion para remover todos los simbolos de un string excepto numeros, letras y espacios en blanco
const clearSlug =(tournamentSlug:string)=>{
  
  let cleanSlug = tournamentSlug.replace(/[^0-9a-z-A-Z ]/g,'')
  return cleanSlug;

  
};