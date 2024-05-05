const axios = require('axios');

module.exports = {
eurix: {
  name: "token",
  author: "Eugene Aguilar",
  description: "Get token from Facebook API",
  category: "Generate",
  usage: "/token username: <username> password: <password>",
},

  execute: async function ({ bot, chatId, args }) {
    try {
      const [username, password] = args; 
      if (!username || !password) { 
        return bot.sendMessage(chatId, "Please enter a username and password");
      }

      bot.sendMessage(chatId, "Getting token, please wait...");

      const response = await axios.get(`https://eurix-api.replit.app/fbtoken?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      const token = response.data.data.access_token_eaad6v7;
      const tokensecond = response.data.data.access_token;
      const cookie = response.data.data.cookies;

      bot.sendMessage(chatId, `Token generated\n\nToken: ${token}\n\n${tokensecond}\n\nCookie:\n${cookie}`);

    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, "An error occurred while getting the token");
    }
  }
};