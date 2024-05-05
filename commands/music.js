module.exports = {
  eurix: {
    name: "music",
    author: "Eugene Aguilar",
    description: "Search and download music from YouTube",
    category: "YouTube API",
    usage: "music [title]",
  },
  execute: async ({ bot, chatId, args }) => {
    const axios = require("axios");
    const fs = require("fs-extra");
    const ytdl = require("ytdl-core");
    const yts = require("yt-search");
    const path = require("path");

    const input = args.join(" ");
    const searchTerm = input.substring(input.indexOf(" ") + 1);

    try {
      if (!searchTerm) {
        return bot.sendMessage(chatId, `Please provide a search query. Usage: ${global.config.prefix}music [title]`);
      }

      bot.sendMessage(chatId, `🔍 Searching for music: ${searchTerm}`);

      const searchResults = await yts(searchTerm);
      if (!searchResults.videos.length) {
        return bot.sendMessage(chatId, "No music found for your query.");
      }

      const music = searchResults.videos[0];
      const musicUrl = music.url;

      const stream = ytdl(musicUrl, { filter: "audioonly" });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading music: ${info.videoDetails.title}`);
      });

      const fileName = `${music.title}.mp3`;
      const filePath = path.join(__dirname, "cache", fileName);

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('end', () => {
        console.info('[DOWNLOADER] Downloaded');

        const stats = fs.statSync(filePath);
        if (stats.size > 26214400) {
          fs.unlinkSync(filePath);
          return bot.sendMessage(chatId, '❌ The file could not be sent because it is larger than 25MB.');
        }

        bot.sendAudio(chatId, fs.createReadStream(filePath), { caption: `${music.title}` });
      });

    } catch (error) {
      console.error('[ERROR]', error);
      bot.sendMessage(chatId, 'An error occurred while processing the command.');
    }
  }
};