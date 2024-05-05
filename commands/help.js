const { readdirSync } = require("fs-extra");

module.exports = {
    eurix: {
        name: "help",
        aliases: ["start", "menu"],
        description: "Shows the command list and their descriptions",
        usage: ["command name", "page number", "all"],
        author: "Lance Ajiro",
        category: "General"
    },
    execute: async function ({ bot, chatId, args }) {
        try {
            const pageNumber = parseInt(args[0]) || 1;
            const commandsPerPage = 15;
            const start = (pageNumber - 1) * commandsPerPage;
            const end = start + commandsPerPage;

            const cmds = process.cwd() + "/commands";

            if (args[0] === "all" || args[0] === "-all" || args[0] === "-a") {
                // Show all commands according to their category
                const allCommands = {};
                const commandFiles = readdirSync(cmds).filter(file => file.endsWith(".js"));

                commandFiles.forEach(file => {
                    const path = require("path").join(cmds, file);
                    const script = require(path);
                    const command = script.jea || {};
                    const { category } = command;

                    if (category) {
                        if (!allCommands[category]) {
                            allCommands[category] = [];
                        }
                        allCommands[category].push(command);
                    }
                });

                const categories = Object.keys(allCommands);
                const helpMessage = categories.map(category => {
                    const commands = allCommands[category];
                    const commandNames = commands.map(command => command.name).join(", ");
                    return `『 ${category.toUpperCase()} 』\n${commandNames}\n`;
                }).join("\n");

                return bot.sendMessage(chatId, helpMessage);
            }

            // Read all command files and filter out non-JS files
            const commandFiles = readdirSync(cmds).filter(file => file.endsWith(".js"));

            // Map each command file to its configuration object
            const commandConfigs = commandFiles.map(file => {
                const path = require("path").join(cmds, file);
                const script = require(path);
                return script.eurix || {}; // Ensure that script.jea exists
            });

            const totalCommands = commandConfigs.length;
            const totalPages = Math.ceil(totalCommands / commandsPerPage);

            if (pageNumber < 1 || pageNumber > totalPages) {
                return bot.sendMessage(chatId, `Invalid page number. Please use a number between 1 and ${totalPages}`);
            }

            const slicedCommands = commandConfigs.slice(start, end);

            const commandList = slicedCommands.map((command, index) => {
                const { name } = command;
                return `⦿ /${name}`;
            }).join("\n");

            const helpMessage = `List of Commands\n\n${commandList}\n\nPage: ${pageNumber}/${totalPages}\nTotal Commands: ${totalCommands}`;

            // Get the command name from arguments
            const commandName = (args[0] || "").toLowerCase();

            // Retrieve the command configuration from the commandConfigs array
            const command = commandConfigs.find(command => command.name && command.name.toLowerCase() === commandName);

            if (command) {
                const { name, description, usage, author, category } = command;

                const commandInfo = `『 ${name} 』\n${description}\n\n` + `⦿ Usage: /${name} ${usage}\n` +
                    `⦿ Category: ${category}\n` + `⦿ Author: ${author}`; 

                return bot.sendMessage(chatId, commandInfo);
            }

            return bot.sendMessage(chatId, helpMessage);
        } catch (error) {
            console.error(error);
            return bot.sendMessage(chatId, "An error occurred while running the command.");
        }
    }
};
