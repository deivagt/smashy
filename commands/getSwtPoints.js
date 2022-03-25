const util = require("util");
const makeFetch = require("../messageManager/makeFetch");
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
let swtLocalPlayersData = {
  players: [],
};
const getSwtPoints = async (interaction) => {
  let query = `query entrantsAllSWT($slug:String, $page:Int ){
  league(slug:$slug){
      standings(query:{page:$page, perPage:150}
      ){
        nodes{
          entrant{
            name              
          }
          player{
            user{
              slug
              images{
                type
                url
              } 
            }
          }              
          placement
          totalPoints            
        }
      }
  }
}`;
  let page = 1;
  let desfase = 0;
  let continueFetch = true;

  let dontQuery = false;
  if (swtLocalPlayersData["LastQuery"] !== undefined) {
    //console.log("no va a hacer el query")
    let actualDate = new Date();
    let diffTime =
      actualDate.getTime() - swtLocalPlayersData["LastQuery"].getTime();
    let resultInMinutes = Math.round(diffTime / 60000);
    if (resultInMinutes < 10) {
      dontQuery = true;
    }
  }

  do {
    //console.log(page);
    if (dontQuery == true) {
      break;
    }
    let variables = {
      slug: "league/swt-ultimate-2022",
      page: page,
    };
    page++;

    await makeFetch(query, variables)
      .then((res) => {
        let allPlayers = res.data.league.standings.nodes;

        if (allPlayers[0] === undefined) {
          continueFetch = false;
        }
        for (let i = 0; i < 150; i++) {
          let playerData = allPlayers[i];
          if (playerData === undefined) {
          } else {
            let newPlayer = "player" + (desfase + i);
            swtLocalPlayersData.players[newPlayer] = playerData;
          }
        }
        desfase += 149; //Incrementa el desfase para seguir jalando data
        //Save the last query time
        swtLocalPlayersData["LastQuery"] = new Date();
      })
      .catch((e) => {
        console.log(e);
      });
  } while (continueFetch);

  let slug = interaction.options.getString("slug");

  let resState = false;
  let emb = undefined;
  for (let i in swtLocalPlayersData.players) {
    let playerData = swtLocalPlayersData.players[i];
    if (playerData.player.user !== null && playerData.player.user.slug.includes(slug)) {
      
      resState = true;
      emb = makePtsEmbed(playerData);
    }
  }

  if (resState) {
    interaction.editReply({
      content:"Encontrado!",
      embeds:[
        emb
       ]
    });
  } else {
    getPlayerData(interaction);
  }
};

const getPlayerData = async (interaction) => {
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
    slug: interaction.options.getString("slug"),
  };
  await makeFetch(query, variables)
    .then((res) => {
      let userData = res.data.user;
      let emb = makeNotFoundEmbed(userData);
      interaction.editReply({
        content: "No encontrado :c",
        embeds:[
          emb
         ]
      });
    })
    .catch((e) => {
      interaction.editReply({
        content: "Jugador no encontrado :c",
      });
    });
};

const makePtsEmbed = (playerData) => {
  let images = playerData.player.user.images;
  let profilePicture = undefined;
  
  if (images[0] !== undefined) {
    if (images[0].type === "profile") {
      profilePicture = images[0].url;
    } else if (images[1] !== undefined) {
      if (images[1].type === "profile") {
        profilePicture =images[1].url;
      }
    }
  }

  let emb = undefined;
  if (profilePicture !== undefined) {
    emb = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(playerData.entrant.name)
      .setThumbnail(profilePicture)
      .addFields(
        { name: "Posicion", value: "#"+playerData.placement },
        { name: "Puntuacion", value: playerData.totalPoints+" pts" },
      );
    //.addField('Inline field title', 'Some value here', true)
  } else {
    emb = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(playerData.entrant.name)
      .addFields(
        { name: "Posicion", value: "#"+playerData.placement },
        { name: "Puntuacion", value: playerData.totalPoints+" pts" },
      );
  }

  return emb;
};

const makeNotFoundEmbed = (userData) => {
  let images = userData.images;
  let profilePicture = undefined;
  
  if (images[0] !== undefined) {
    if (images[0].type === "profile") {
      profilePicture = images[0].url;
    } else if (images[1] !== undefined) {
      if (images[1].type === "profile") {
        profilePicture =images[1].url;
      }
    }
  }

  let emb = undefined;
  if (profilePicture !== undefined) {
    emb = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle( userData.player.gamerTag)
      .setThumbnail(profilePicture)
      .addFields(
        { name: "Posicion", value: "#?" },
        { name: "Puntuacion", value:"0 pts" },
      );
  } else {
    emb = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(userData.player.gamerTag)
    .addFields(
      { name: "Posicion", value: "#?" },
      { name: "Puntuacion", value:"0 pts" },
    );
  }

  return emb;
};

const data = new SlashCommandBuilder()
  .setName("swtpts")
  .setDescription("Obten tus puntos del Smash World Tour!")
  .addStringOption((option) =>
    option.setName("slug").setDescription("slug del jugador").setRequired(true)
  );

module.exports = {
  data: data,
  async execute(interaction) {
    await interaction.reply("Buscando...");
    await getSwtPoints(interaction);
  },
};
