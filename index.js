const DiscordJS = require('discord.js');
const Intents = DiscordJS.Intents;
const dotenv = require('dotenv');
dotenv.config();

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.on('ready', ()=> {
    console.log('Bot funcionando');
});

client.on('messageCreate',(message)=>{
    if(message.content === "ping"){
        message.reply({
            content: "pong",
        });
    }
});
client.login(process.env.TOKEN);
