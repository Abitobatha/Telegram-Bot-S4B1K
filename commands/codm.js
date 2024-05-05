const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports = {
    eurix: {
        name: 'codm',
        description: 'Generate random Call of Duty Mobile videos',
        author: 'Anonymous',
        usage: ['[codm]'],
        category: 'Entertainment'
    },
    execute: async function ({ bot, chatId }) {
        try {
            bot.sendMessage(chatId, 'codm is sending please wait...');

            const response = await axios.post('https://codm-cutie.onrender.com/api/request/f');
            const video = response.data.url;
            const username = response.data.username;
            const nickname = response.data.nickname;
            const title = response.data.title;

            let codmPath = path.join(__dirname, 'cache', 'codm.mp4');

            const dl = await axios.get(video, { responseType: 'arraybuffer' });

            fs.writeFileSync(codmPath, Buffer.from(dl.data, 'utf-8'));

            bot.sendVideo(chatId, fs.createReadStream(codmPath), {
                caption: `Call of Duty Mobile\n\nUsername: ${username}\nNickname: ${nickname}\nTitle: ${title}`
            });
        } catch (err) {
            console.error(err);
            bot.sendMessage(chatId, 'Error occurred while processing your request.');
        }
    }
};