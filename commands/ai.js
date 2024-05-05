const axios = require('axios');

module.exports = {
  eurix: {
    name: "ai",
    author: "Eugene Aguilar",
    description: "Interacts with a GPT-4 API",
    category: "ai",
    usage: "[question]",
  },

  execute: async function ({ bot, chatId, args }) {
    try {
      const prompt = args.join(" ");
      if (!prompt) {
        bot.sendMessage(chatId, `Usage:\n• ${global.config.prefix}ai [prompt]`);
        return;
      }

      const response = await axios.get(`https://eurix-api.replit.app/hercai?ask=${encodeURIComponent(prompt)}`);
      const answer = response.data.answer;

      bot.sendMessage(chatId, answer);
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      bot.sendMessage(chatId, `Error fetching GPT-4 API: ${errorMessage}`);
      console.error(`Error fetching GPT-4 API: ${errorMessage}`);
    }
  }
};