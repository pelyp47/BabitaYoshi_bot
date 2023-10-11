import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from "discord.js";
import { getCourseFullName, getMeetingSuffix } from "../functions"
import { SlashCommand, UserToEnroll } from "../types";
import axios from "axios"
import dotenv from 'dotenv';

dotenv.config();

const createCohort = {
   command: new SlashCommandBuilder()
      .setName('create-cohort-channel')
      .setDescription('Creates a cohort channel')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addChannelOption(option => 
         option.setName('category-name')
         .setDescription('Choose channel Category')
         .addChannelTypes(ChannelType.GuildCategory)
         .setRequired(true)
      )
      .addStringOption(option => 
         option.setName('channel-type')
         .setDescription('Set the type of the channel')
         .addChoices(
            {name: 'Text channel', value: 'textchannel'},
            {name: 'Voice channel', value: 'voicechannel'}
         )
         .setRequired(true)   
      )
      .addStringOption(option => 
         option.setName('channel-name')
         .setDescription('Create channel category')
         .setRequired(true)
      )
      .addBooleanOption(option => 
         option.setName('private')
         .setDescription('Should the channel be private?')
         .setRequired(true)
      )
      .addStringOption(option => 
         option.setName('cohort-name')
         .setDescription('Create channel category')
         .setRequired(true)
      ),
         
   execute: async (interaction: any) => {
      const { guild, options} = interaction
      const {ViewChannel} = PermissionFlagsBits


      const channelCategory = options.getChannel('category-name')
      const channelType = options.getString('channel-type')
      const channelName = options.getString('channel-name')
      const isPrivate = options.getBoolean('private')
      const cohortName = options.getString('cohort-name')//options.getString('cohort-name')

      try {
         await interaction.deferReply({ ephemeral: true })
         
         const permissions = isPrivate ? [{
            id: guild?.roles.everyone.id,
            deny: [ViewChannel]
         }] : []

         let createdChannel
         if(channelType === 'textchannel') {
            createdChannel = await guild?.channels.create({
               name: channelName,
               type: ChannelType.GuildText,
               parent: channelCategory,
               permissionOverwrites: permissions
            })
         }

         if(channelType === 'voicechannel') {
            createdChannel = await guild?.channels.create({
               name: channelName,
               type: ChannelType.GuildVoice,
               parent: channelCategory,
               permissionOverwrites: permissions
            })
         }
         
         if(isPrivate && channelType === 'textchannel') {

            const headers = {
               "Api-Token": `${process.env.API_TOKEN}`
            }
            const cohort = await axios.get(`https://dune-abundant-candle.glitch.me/api/interns?cohort=${cohortName}`, {headers}).then(response => {
               return response.data;
            });
            console.log(cohort)

            // const cohort = [
            //    {
            //       "id": 12345,
            //       "explorerId": "johndoe123",
            //       "explorerMail": "johndoe@gmail.com",
            //       "explorerPassword": "securePassword123",
            //       "discordNickname": "nikitakutsokon",
            //       "discordId": "",
            //       "cohort": "SEP 2023",
            //       "contactId": 5678
            //    },
            //    {
            //       "id": 12345,
            //       "explorerId": "johndoe123",
            //       "explorerMail": "johndoe@gmail.com",
            //       "explorerPassword": "securePassword123",
            //       "discordNickname": ".dima228228",
            //       "discordId": "",
            //       "cohort": "SEP 2023",
            //       "contactId": 5678
            //    },
            //    {
            //       "id": 12345,
            //       "explorerId": "johndoe123",
            //       "explorerMail": "johndoe@gmail.com",
            //       "explorerPassword": "securePassword123",
            //       "discordNickname": ".dan1a",
            //       "discordId": "",
            //       "cohort": "SEP 2023",
            //       "contactId": 5678
            //    },
            // ]
            
          
            let usersToEnroll: UserToEnroll[]  = []
            
            cohort.map((user: any) => {
               usersToEnroll.push({ nickName: user.discordNickname, userId: user.discordId})
            })

            // console.log(usersToEnroll)

            const users = await guild.members.fetch() // HOW TO AVOID USING THAT EVERY TIME?
            
            console.log(users.map((user: any) => {
               return {id: user.user.id, nick: user.user.username}
            }))

            for (const user of usersToEnroll) {
               let member

               if(user.userId) {
                  member = guild.members.cache.get(user.userId)
               } else {
                  member = guild.members.cache.find((member: any) => member.user.username === user.nickName)
               }
               if(member) {
                  // console.log(`snowflake is ${member.id}`)
                  const fetchedUser  = await guild.members.fetch(member.id)

                  if (fetchedUser) {
                     await createdChannel.permissionOverwrites.create(fetchedUser, {
                        ViewChannel: true,
                     })
                  }
               }
            }


            const internsRoleID = '849359196142174208' //1158116315802898503
            const internsMention = `<@&${internsRoleID}>`
   
            const helloMessage = [`Hello ${internsMention}!`,
            '',
            `⭐ This channel will be used for updating new information for your cohort and a way to keep in touch with everyone😄 `,
            '',
            `You can also ask any questions you have regarding the internship here!💥`,].join('\n')

            createdChannel.send(helloMessage)
         }
         
         return interaction.editReply({ content: `:bread: Channel ${channelName} created successfully :bread:` })
      } catch(error) {
         console.log(error)
         interaction.editReply({content: 'Something went wrong'})
      }
   }
    
};

export default createCohort