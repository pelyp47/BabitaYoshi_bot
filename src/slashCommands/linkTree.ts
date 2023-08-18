import { 
    CacheType,
    SlashCommandBuilder,
    ChatInputCommandInteraction  
} from "discord.js";

import { SlashCommand } from "../types";


const LINK_TREE_URL = "https://linktr.ee/your_internship";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("link-tree")
        .setDescription("This command send you all useful links about your intership"),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        try {
            await interaction.deferReply({ ephemeral: true });

            const user = interaction.user;
            const linkText = "Click here for your internship link tree";
            const formattedLink = `[${linkText}](${LINK_TREE_URL})`;

            await user.send(formattedLink);
            await interaction.editReply("Check your private messages for the link tree!");
        } catch (e) {
            console.error("An error occurred:", e);
            await interaction.editReply("Something went wrong...");
        }
    },
    cooldown: 10,
};

export default command;