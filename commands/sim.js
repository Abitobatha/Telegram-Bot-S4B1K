const axios = require("axios");

module.exports = {
  eurix: {
    name: "sim",
    author: "Eugene Aguilar",
    description: "Talk with simsimi",
    category: "fun",
    usage: "[ask]",
  },
  execute: async function ({ bot, chatId, args }) {
    try {
      const ask = args.join(" ");
      if (!ask) {
        return bot.sendMessage(chatId, "Please enter a message.");
      }

      const response = await axios.get(`https://eurix-api.replit.app/sim?ask=${encodeURIComponent(ask)}`);
      const reply = response.data.respond;
      await bot.sendMessage(chatId, reply);
    } catch (error) {
      console.error("Error:", error);
      await bot.sendMessage(chatId, "Sorry, something went wrong.");
    }
  }
};