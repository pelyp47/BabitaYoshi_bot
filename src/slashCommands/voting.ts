import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalActionRowComponentBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("voting")
        .addStringOption(option => {
            return option
                .setName("title")
                .setDescription("Title of the poll")
                .setRequired(true);
        })
        .setDescription("Create a new poll"),    

    execute: async (interaction) => {
        const modal: ModalBuilder = new ModalBuilder()
            .setCustomId('pollmodal')
            .setTitle("Create a new poll")

            let actionRows = []

            for(let i = 1; i <= 5; i++) {
                const optionInput: TextInputBuilder = new TextInputBuilder()
                .setCustomId(`optioninput${i}`)
                .setLabel(`Option ${i}`)
                .setStyle(TextInputStyle.Short);

                const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(optionInput);
                actionRows.push(actionRow)

            }

        modal.addComponents(actionRows)

        interaction.showModal(modal)
    },
    cooldown: 10
};

export default command;