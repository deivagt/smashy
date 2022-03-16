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
  if (message.content === "ping") {

    myFunction()
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
const variables = { slug: "2cbabf4a" };

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

const myFunction = () =>
  fetch(urlApi, options)
    .then((r) => r.json())
    .then((data) =>{ return printJson(data)});



const printJson = (response: any)=> {
  let gamerTag = response.data.user.player.gamerTag;
  console.log(response.data.user.player.gamerTag);
  return gamerTag;
}
