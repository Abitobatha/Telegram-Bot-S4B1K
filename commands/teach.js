const axios = require("axios");

module.exports = {
eurix : {
	name: "teach",
	author: "Eugene Aguilar",
	description: "Teach Simsimi",
	usage: "Teach",
	category: "fun",
},

execute: async ({ bot, chatId, args }) => {
	try {
		const text = args.join(" ");
		const text1 = text.substr(0, text.indexOf(' => '));
		const text2 = text.split(" => ").pop();

		if (!text1 || !text2) {
			return bot.sendMessage(chatId,`Usage: ${global.config.prefix}teach hi => hello`);
		}

		const response = await axios.get(`https://eurix-api.replit.app/teach?ask=${encodeURIComponent(text1)}&ans=${encodeURIComponent(text2)}`);
		bot.sendMessage(chatId, `Your ask: ${text1}\nSim respond: ${text2}`);
	} catch (error) {
		console.error("An error occurred:", error);
		bot.sendMessage(chatId, "Oops! Something went wrong.");
	}
}
};