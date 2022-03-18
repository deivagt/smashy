import DiscordJS, { Intents, Message } from "discord.js";
import{ getTop20SWT} from "./messageManager/getTop20SWT";
import {getTop8ByTournament} from"./messageManager/getTop8ByTournament"
import { getUpcomingTournament } from "./messageManager/getUpcomingTournament";
import { getGamertag } from "./messageManager/getGamertag";
import { getSwtPoints } from "./messageManager/getSwtPoints";
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
//Recibir y procesar mensaje
client.on("messageCreate", (message) => messageProcess(message));
//funcion para hacer funcionar el bot
client.login(process.env.TOKEN);


const messageProcess = (message:any)=>{
  //separar comando del mensaje
  
let newMessage = processMessage(message);

  if(newMessage.prefix==="!"){
   //console.log(command);
    if ( newMessage.command=== "gamertag") {

      //Separar slug del mensaje
      let playerSlug = newMessage.parameter;
      getGamertag(message,playerSlug);
      
    }

    else if(newMessage.command === "top8"){
      let cleanSlug = clearSlug(newMessage.parameter);
      cleanSlug = cleanSlug.replace(/ /g,'-');
      cleanSlug = "tournament/"+cleanSlug;
      getTop8ByTournament(message,cleanSlug);
    } 
    else if(newMessage.command === "upcoming"){
     
      getUpcomingTournament(message,newMessage.parameter);
    } 
    else if(newMessage.command === "swtpoints"){
      getSwtPoints(message,newMessage.parameter);
    } 
    else if(newMessage.command === "swttop"){
      newMessage.parameter = "league/swt-ultimate-2022";
     getTop20SWT(message,newMessage.parameter);
    } 
    
    else if(newMessage.command=== "help"){
      message.reply({
        content: 
        `Comandos disponibles: 
          !gamertag [slug] - Devuelve el gamertag del usuario
          !top8 [tourneyName] - Devuelve el top 8 del torneo indicado
          !upcoming [countryCode] - Devuelve proximos torneos del pais indicado
          !swttop - Devuelve el top 20 del Smash World Tournament actual
        `,
      })
    } 
    else{
      message.reply({
        content: "No entiendo 0te",
      })
    }
  }
};

const processMessage = (message:any)=>
{
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

  let newMessage = {
    prefix : prefix,
    command:command,
    parameter:parameter
  }
  return newMessage;
};

  //Funcion para remover todos los simbolos de un string excepto numeros, letras y espacios en blanco
const clearSlug =(tournamentSlug:string)=>{
  
  let cleanSlug = tournamentSlug.replace(/[^0-9a-z-A-Z ]/g,'')
  return cleanSlug;

  
};



