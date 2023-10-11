import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("schedule")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption(option => {
            return option
                .setName("cohort")
                .setDescription("Your cohort")
                .setRequired(true);
        })
        .setDescription("Your Internship schedule."),

    execute: async (interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true });

            const cohort = interaction.options.getString("cohort");

            const user = interaction.user;
            // const userDiscordId = `${interaction.user.username}#${interaction.user.discriminator}`;
            user.send(`Here is your schedule: ${cohort}`);
            

            return interaction.editReply({ content: "Your schedule was successfully sent in private messages." });
        } catch (error) {
            interaction.editReply({ content: "Something went wrong..." });
        }
    },
    cooldown: 10
};

export default command;
