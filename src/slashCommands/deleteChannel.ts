import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
// import { SlashCommand } from "../types";

const command = {
   command: new SlashCommandBuilder()
      .setName('delete-channel')
      .setDescription('Delete a discord channel')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addChannelOption(option => 
         option.setName('channel')
         .setDescription('Select the channel you want to delete')
         .setRequired(true)
      ),

      async execute(interaction: any) {
         const {options} = interaction
         
         const channel = options.getChannel('channel')
         
         try {
            await interaction.deferReply({ ephemeral: true });
            await channel.delete()
            await interaction.editReply({content: `Channel deleted successfully`})

         } catch(error) {
            console.log(error)
         }
      },
      cooldown: 10
      
}

export default command;
