import { SlashCommandBuilder } from "discord.js";
// import { SlashCommand } from "../types";

const command = {
   command: new SlashCommandBuilder()
      .setName('send-linktree')
      .setDescription('🔗 Sends your linktree (important links)'),
      async execute(interaction: any) {
         const linktreeUrl = 'https://linktr.ee/your_internship'; 
         await interaction.reply({
           content: `Here is your linktree: ${linktreeUrl}`,
           ephemeral: true
         });
      },
   cooldown: 10

}

export default command