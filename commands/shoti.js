  const fs = require("fs");
  const axios = require("axios");
  const path = require("path");

  module.exports = {
    eurix: {
      "name": "shoti",
      "description": "Get random eabab from tikvm",
      "usage": "simple type",
      "author": "Eugene Aguilar",
      "category": "fun",
    },
    execute: async function ({ bot, chatId, args }) {
      try {
        bot.sendMessage(chatId, "🕥 shoti is sending please wait...");

        const response = await axios.post(`https://eurix-api.replit.app/shoti`);
        const username = response.data.username;
        const nickname = response.data.nickname;
        const url = response.data.url;

        let shotiPath = path.join(__dirname, "cache", "shoti.mp4");

const video = await axios.get(url, {
responseType: "arraybuffer" });

        fs.writeFileSync(shotiPath, Buffer.from(video.data, "binary"));

        bot.sendVideo(chatId, fs.createReadStream(shotiPath), {
          caption: `Username: ${username}\nNickname: ${nickname}`
        });
      } catch (error) {
        console.error("Error occurred:", error);
        bot.sendMessage(chatId, "An error occurred while processing your request.");
      }
    }
  };