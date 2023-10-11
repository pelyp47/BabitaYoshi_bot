import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from "discord.js";
import { getCourseFullName, getMeetingSuffix, getLmsLink } from "../functions"
import { SlashCommand, DiscordUser, Participant, Meeting } from "../types";
import dotenv from 'dotenv'
import axios from "axios"
import moment from "moment"

dotenv.config()

const command = {
   command: new SlashCommandBuilder()
      .setName('create-channel')
      .setDescription('Creates a channel')
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
         option.setName('course-name')
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
      const courseNameCipher = options.getString('course-name')
      console.log(courseNameCipher)
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
            // const course = await axios.get("https://dune-abundant-candle.glitch.me/api/courses").then(response => {
            //    return response.data
            // })
            const headers = {
               "Api-Token": `${process.env.API_TOKEN}`
            }
         
            const course = await axios.get(`https://dune-abundant-candle.glitch.me/api/courses/${courseNameCipher}/details`, {headers}).then(response => {
               return response.data;
            })
            console.log(course)

            // const course = {
            //    "id": 1,
            //    "courseName": "iwd1",
            //    "courseCipher": "iIWD336-6-a",
            //    "linkToClassMaterials": "link",
            //    "startDate": "2023-11-12T00:00:00.000Z",
            //    "endDate": "2023-11-29T00:00:00.000Z",
            //    "participants": {
            //       "facilitators": [
            //          {
            //          "explorerId": "e1",
            //          "explorerMail": "string",
            //          "explorerPassword": "string",
            //          "discordNickname": "nikitakutsokon",
            //          "discordId": "",
            //          "cohort": "string",
            //          "contactInfo": {
            //             "id": 1,
            //             "firstName": "firstUpdated",
            //             "lastName": "lastName",
            //             "email": "email",
            //             "age": 15,
            //             "country": "country",
            //             "timezone": "timezone",
            //             "sourceOfReferral": "sourceOfReferral",
            //             "eduQuestSelectedDateTime": "2023-06-08T00:00:00.000Z",
            //             "eduQuestDecision": "Try again"
            //          }
            //          },
            //          {
            //             "explorerId": "e1",
            //             "explorerMail": "string",
            //             "explorerPassword": "string",
            //             "discordNickname": ".dan1a",
            //             "discordId": "",
            //             "cohort": "string",
            //             "contactInfo": {
            //                "id": 1,
            //                "firstName": "firstUpdated",
            //                "lastName": "lastName",
            //                "email": "email",
            //                "age": 15,
            //                "country": "country",
            //                "timezone": "timezone",
            //                "sourceOfReferral": "sourceOfReferral",
            //                "eduQuestSelectedDateTime": "2023-06-08T00:00:00.000Z",
            //                "eduQuestDecision": "Try again"
            //             }
            //             }
            //       ],
            //       "oversights": [
            //          {
            //          "explorerId": "e1",
            //          "explorerMail": "string",
            //          "explorerPassword": "string",
            //          "discordNickname": "string",
            //          "discordId": "",
            //          "cohort": "string",
            //          "contactInfo": {
            //             "id": 1,
            //             "firstName": "firstUpdated",
            //             "lastName": "lastName",
            //             "email": "email",
            //             "age": 15,
            //             "country": "country",
            //             "timezone": "timezone",
            //             "sourceOfReferral": "sourceOfReferral",
            //             "eduQuestSelectedDateTime": "2023-06-08T00:00:00.000Z",
            //             "eduQuestDecision": "Try again"
            //          }
            //          }
            //       ],
            //       "interns": [
            //          {
            //          "explorerId": "someExId",
            //          "explorerMail": "some mail",
            //          "explorerPassword": "some password",
            //          "discordNickname": "nameDisc",
            //          "discordId": "",
            //          "cohort": "cohort",
            //          "contactInfo": {
            //             "id": 5,
            //             "firstName": "firstUpdated",
            //             "lastName": "lastName",
            //             "email": "email2",
            //             "age": 15,
            //             "country": "country",
            //             "timezone": "timezone",
            //             "sourceOfReferral": "sourceOfReferral",
            //             "eduQuestSelectedDateTime": "2023-06-08T00:00:00.000Z",
            //             "eduQuestDecision": "Try again"
            //          }
            //          }
            //       ]
            //    },
            //    "schedule": [
            //       {
            //          "meetNumber": 1,
            //          "eventDate": "2023-06-01T00:00:00.000Z",
            //          "googleMeetLink": "some link",
            //          "classEventType": "meet"
            //       },
            //       {
            //          "meetNumber": 2,
            //          "eventDate": "2023-06-02T00:00:00.000Z",
            //          "googleMeetLink": "some link",
            //          "classEventType": "meet"
            //       },
            //       {
            //          "meetNumber": 3,
            //          "eventDate": "2023-06-03T00:00:00.000Z",
            //          "googleMeetLink": "some link",
            //          "classEventType": "meet"
            //       },
            //       {
            //          "meetNumber": 3,
            //          "eventDate": "2023-06-05T00:00:00.000Z",
            //          "googleMeetLink": "some link",
            //          "classEventType": "expo"
            //       },
            //    ]
            // }

            const startDate = moment(course.startDate).format("MMMM Do");
            let schedule = []
            if(course.schedule.length > 0) {
               schedule = course.schedule.map((meeting: Meeting, index: number) => {
                  const formattedDate = moment(meeting.eventDate).format("MMMM Do");
                  const meetingSuffix = getMeetingSuffix(index + 1, courseNameCipher);
                  return `${formattedDate} - ${meetingSuffix}`;
              })
            } else {
               throw Error('Schedule is emtpy');
            }

            const participants = course.participants;

            let usersToEnroll: DiscordUser[] = [];

            if (participants.length > 0) {
               participants.oversights.map((oversight: Participant) => {
                  usersToEnroll.push({role: 'o', nickName: oversight.discordNickname, userId: oversight.discordId || ''});
               })
               participants.facilitators.map((facilitator: Participant) => {
                  usersToEnroll.push({role: 'f', nickName: facilitator.discordNickname, userId: facilitator.discordId || ''});
               })
               participants.interns.map((intern: Participant) => {
                  usersToEnroll.push({role: 'i', nickName: intern.discordNickname, userId: intern.discordId || ''});
               })
            } else {
               throw Error('Participants is empty');
            }

            console.log(usersToEnroll)

            const users = await guild.members.fetch(); // HOW TO AVOID USING THAT EVERY TIME?

            let facilitatorIds: string[] = [];
            let oversightsIds: string[] = [];

            for (const user of usersToEnroll) {
               let member;

               if(user.userId) {
                  member = guild.members.cache.get(user.userId);
               } else {
                  member = guild.members.cache.find((member: any) => member.user.username === user.nickName);
               }
                  
               if(member) {
                  // console.log(`snowflake is ${member.id}`)
                  const fetchedUser = await guild.members.fetch(member.id);
                  if (fetchedUser) {
                     await createdChannel.permissionOverwrites.create(fetchedUser, {
                        ViewChannel: true,
                     })

                     if(user.role === 'o') {
                        oversightsIds.push(fetchedUser.id);
                     } else if (user.role === 'f') {
                        facilitatorIds.push(fetchedUser.id);
                     }
                  }
               }
            }


            console.log(facilitatorIds)
            const courseFullName = course.courseName;

            let oversightStr = '';
            if(oversightsIds.length > 0) {
               oversightStr = `Oversight: ${oversightsIds.map(id => `<@${id}>`).join(', ')}`;
            }

            const internsRoleID = '849359196142174208'; //1158116315802898503
            const internsMention = `<@&${internsRoleID}>`;

            const lmsLink = getLmsLink(courseNameCipher)
            const helloMessage = [`Hello ${internsMention}!`,
            `You are starting your ${courseFullName} course from ${startDate}`,
            `All communication will be here on Discord`,
            '',
            `Course details:`,
            `${courseNameCipher}`,
            `Facilitators: ${facilitatorIds.map(id => `<@${id}>`).join(', ')}`,
            oversightStr,
            '',
            `Schedule:`,
            schedule.join('\n'),
            '',
            `LMS material: ${lmsLink}`].join('\n');

            createdChannel.send(helloMessage);
         }
         
         return interaction.editReply({ content: `:bread: Channel ${channelName} created successfully :bread:` });
      } catch(error) {
         console.log(error)
         interaction.editReply({content: `${error}`})
      }
   }
    
};

export default command