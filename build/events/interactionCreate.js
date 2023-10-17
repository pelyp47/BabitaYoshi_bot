"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let optionValues = [];
let pollTitle = '';
const event = {
    name: "interactionCreate",
    execute: (interaction) => {
        if (interaction.isChatInputCommand()) {
            let command = interaction.client.slashCommands.get(interaction.commandName);
            let cooldown = interaction.client.cooldowns.get(`${interaction.commandName}-${interaction.user.username}`);
            if (!command)
                return;
            if (interaction.commandName == 'voting') {
                pollTitle = interaction.options.getString('title');
            }
            if (command.cooldown && cooldown) {
                if (Date.now() < cooldown) {
                    interaction.reply(`You have to wait ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} second(s) to use this command again.`);
                    setTimeout(() => interaction.deleteReply(), 5000);
                    return;
                }
                interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 1000);
                setTimeout(() => {
                    interaction.client.cooldowns.delete(`${interaction.commandName}-${interaction.user.username}`);
                }, command.cooldown * 1000);
            }
            else if (command.cooldown && !cooldown) {
                interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 1000);
            }
            command.execute(interaction);
        }
        else if (interaction.isAutocomplete()) {
            const command = interaction.client.slashCommands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                if (!command.autocomplete)
                    return;
                command.autocomplete(interaction);
            }
            catch (error) {
                console.error(error);
            }
        }
        else if (interaction.isModalSubmit()) {
            const pollOptions = interaction.fields.fields;
            let voteButtons = [];
            for (let [idx, input] of pollOptions) {
                optionValues.push({ name: '\u2006', value: '\u2006' });
                optionValues.push({ name: `Option ${idx.at(-1)}`, value: input.value });
                const voteButton = new discord_js_1.ButtonBuilder()
                    .setCustomId(`votebutton${idx.at(-1)}`)
                    .setLabel('Vote')
                    .setStyle(discord_js_1.ButtonStyle.Primary);
                const row = new discord_js_1.ActionRowBuilder().addComponents(voteButton);
                voteButtons.push(row);
            }
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(`New Poll: ${pollTitle}`)
                .addFields(optionValues);
            interaction.reply({ embeds: [embed], components: [] });
        }
    }
};
exports.default = { event };
