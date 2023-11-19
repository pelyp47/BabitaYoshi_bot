import { SlashCommandBuilder } from "discord.js";
// import { SlashCommand } from "../types";

const command = {
   command: new SlashCommandBuilder()
      .setName('leave-feedback')
      .setDescription('Share your thoughts and ideas'),
      async execute(interaction: any) {
         const feedbackFormUrl = 'https://forms.gle/s3mTgHuoAuzzFXuE7'; 
         await interaction.reply({
           content: `You can leave feedback using this form: ${feedbackFormUrl}`,
           ephemeral: true
         });
      },
   cooldown: 10

}

export default command
