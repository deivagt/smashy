const makeFetch=require("../messageManager/makeFetch");
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const getGamertag = async (interaction)=>{
    let query = `query userId($slug:String){
      user(slug:$slug){
        player { 
          gamerTag        
        }
        images{
          type
          url
        }      
      }
    }`;
    let variables = {
      slug:interaction.options.getString('slug')
    }
    
    makeFetch(query,variables)  
    .then((res)=>{
      let gamerTag = res.data.user.player.gamerTag
      let banner = undefined;
      let profile = undefined;
      let images = res.data.user.images;
      if(images[0] !== undefined){
        if(res.data.user.images[0].type === "profile"){          
          profile = res.data.user.images[0].url;
        }else if(images[1] !== undefined){
          if(res.data.user.images[1].type === "profile"){
            profile = res.data.user.images[1].url;
          }
        }
      }
        
        let embd = makeEmbed(gamerTag,profile)
        interaction.reply({
          embeds:[
           embd
          ]
        })
      
       
    })
    .catch((e) => {
      console.log(e);
      interaction.reply({
        
        content: "Jugador no encontrado :c"
      })
    });
   
  }


  const makeEmbed = (gamerTag, profilePicture)=>{
    let emb = undefined;
    if(profilePicture !== undefined){
      emb = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(gamerTag)
      .setThumbnail(profilePicture)
      .addFields(
        { name: 'Regular field title', value: 'Some value here' },
        //{ name: '\u200B', value: '\u200B' },
        //{ name: 'Inline field title', value: 'Some value here', inline: true },
      )
      //.addField('Inline field title', 'Some value here', true)
    }else{
      emb = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(gamerTag)
      .addFields(
        { name: 'Regular field title', value: 'Some value here' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        { name: 'Inline field title', value: 'Some value here', inline: true },
      )
      .addField('Inline field title', 'Some value here', true)
      
    }
     

    return emb;
  }

  const data =  new SlashCommandBuilder()
  .setName('profile')
  .setDescription('Obten el gamertag de un jugador!')
  .addStringOption(option =>
    option.setName('slug')
      .setDescription('slug del jugador')
      .setRequired(true));

      const embed = 

  module.exports = {
    data: data,
    async execute(interaction) {
      await getGamertag(interaction);
    },
  };