import DiscordJS, { Intents } from "discord.js";
import fetch from "node-fetch";
import dotenv from "dotenv";

const util = require('util');

dotenv.config();

const client = new DiscordJS.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log("Bot funcionando");
});

client.on("messageCreate", (message) => {
  //largo del comando gamertag
  let gamertagLenght = 9;
  //separar comando del mensaje
  let commmand = message.content.substring(0,gamertagLenght);
  
  if (commmand === "!gamertag") {
    //Separar slug del mensaje
    let playerSlug = message.content.substring(gamertagLenght+1, message.content.length);
    getGamertag(playerSlug)
    .then((data)=>{
      message.reply({
        content: data,
      })
    });
  }
});
client.login(process.env.TOKEN);

const urlApi = "https://api.smash.gg/gql/alpha";

const query = `query userId($slug:String){
    user(slug:$slug){
      player { 
        gamerTag        
      }      
    }
  }`;
let variables = { slug: "" };

const options = {
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
};

const getGamertag = (playerSlug:string) =>
 
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
        variables: 
        {
          "slug": playerSlug
        },
      }),
    }
    
    )
    .then((r) => r.json())
    .then((data) =>{ return printJson(data)});



const printJson = (response: any)=> {
  let gamerTag = response.data.user.player.gamerTag;
  return gamerTag;
}
