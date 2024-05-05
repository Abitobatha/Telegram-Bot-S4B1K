const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  eurix: {
    name: "tikdl",
    description: "Download video from Tikvm",
    author: "Eugene Aguilar",
    category: "Downloader",
    usage: "Tikdl",
  },
  execute: async function ({ bot, chatId, args }) {
    try {
      const link = args.join(" ");
      if (!link) {
        return bot.sendMessage(chatId, "Please provide a link from tiktok upload");
      }

      const response = await axios.get(`https://eurix-api.replit.app/tikdl?link=${encodeURIComponent(link)}`);
      const { username, nickname, title, heart, comment, share, url } = response.data.data;

      const videoResponse = await axios.get(url, {
        responseType: "arraybuffer"
      });

      const videoBuffer = videoResponse.data;

      const urlPath = path.join(__dirname, "cache", "tiktok.mp4");
      fs.writeFileSync(urlPath, videoBuffer);

      await bot.sendVideo(chatId, fs.createReadStream(urlPath), {
        caption: `Downloaded Successfully\n\nUsername: ${username}\nNickname: ${nickname}\nTitle: ${title}\nHeart: ${heart}\nComment: ${comment}\nShare: ${share}`
      });
    } catch (error) {
      bot.sendMessage(chatId, `Error fetching tikvm api ${error}`);
      console.log(error);
    }
  }
};