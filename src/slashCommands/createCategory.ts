import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from "discord.js";
// import { SlashCommand } from "../types";

const command = {
   command: new SlashCommandBuilder()
   .setName('create-category')
   .setDescription('Creates category')
   .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
   .addStringOption(option => 
      option.setName('category-name')
      .setDescription('Type category name')
      .setRequired(true)
   ),
   execute: async (interaction: any) => {
      const { options, guild } = interaction 

      const category = options.getString('category-name')
      console.log(category)
      try {
         await guild?.channels.create({
            name: category,
            type: ChannelType.GuildCategory
         })
      } catch(error) {
         console.log(error)
      }
   }
}

export default command