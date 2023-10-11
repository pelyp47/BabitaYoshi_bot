import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from "discord.js";
import { getCourseFullName, getMeetingSuffix } from "../functions";
import { SlashCommand, FacToEnroll, Course } from "../types";
import axios from "axios";
import moment from "moment";
import dotenv from 'dotenv';

dotenv.config();

const facChannel = {
   command: new SlashCommandBuilder()
      .setName('create-facilitator-channel')
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
         option.setName('courses-name')
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
      const inputCourses = options.getString('courses-name')
      const coursesArray = inputCourses.trim().split(',')
      console.log(coursesArray)
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
            const courses: Course[] = []
            // request
            const headers = {
               "Api-Token": `${process.env.API_TOKEN}`
            }
            for(const course of coursesArray) {
               await axios.get(`https://dune-abundant-candle.glitch.me/api/courses/${course}/details`, {headers}).then(response => {
                  courses.push(response.data)
                  return response.data;
               });
            } 
            console.log(courses)
            // const courses = [
            //    { 
            //       "id": 1,
            //       "courseName": "Intro to Web Design",
            //       "courseCipher": "iIWD336-6-a",
            //       "linkToClassMaterials": "http//:linkToFolderAAA",
            //       "startDate": "2023-11-12T00:00:00.000Z",
            //       "endDate": "2023-11-29T00:00:00.000Z",
            //       "participants": {
            //          "facilitators": [
            //             {
            //             "explorerId": "e1",
            //             "explorerMail": "string",
            //             "explorerPassword": "string",
            //             "discordNickname": "",
            //             "discordId": "750985349936971786",
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
            //             },
            //             {
            //                "explorerId": "e1",
            //                "explorerMail": "string",
            //                "explorerPassword": "string",
            //                "discordNickname": "",
            //                "discordId": "562545695102337024",
            //                "cohort": "string",
            //                "contactInfo": {
            //                   "id": 1,
            //                   "firstName": "firstUpdated",
            //                   "lastName": "lastName",
            //                   "email": "email",
            //                   "age": 15,
            //                   "country": "country",
            //                   "timezone": "timezone",
            //                   "sourceOfReferral": "sourceOfReferral",
            //                   "eduQuestSelectedDateTime": "2023-06-08T00:00:00.000Z",
            //                   "eduQuestDecision": "Try again"
            //                }
            //                }
            //          ],
            //          "oversights": [
            //             {
            //             "explorerId": "e1",
            //             "explorerMail": "string",
            //             "explorerPassword": "string",
            //             "discordNickname": "dimanaumets",
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
            //          ],
            //          "interns": [
            //             {
            //             "explorerId": "someExId",
            //             "explorerMail": "some mail",
            //             "explorerPassword": "some password",
            //             "discordNickname": "nameDisc",
            //             "discordId": "",
            //             "cohort": "cohort",
            //             "contactInfo": {
            //                "id": 5,
            //                "firstName": "firstUpdated",
            //                "lastName": "lastName",
            //                "email": "email2",
            //                "age": 15,
            //                "country": "country",
            //                "timezone": "timezone",
            //                "sourceOfReferral": "sourceOfReferral",
            //                "eduQuestSelectedDateTime": "2023-06-08T00:00:00.000Z",
            //                "eduQuestDecision": "Try again"
            //             }
            //             }
            //          ]
            //       },
            //       "schedule": [
            //          {
            //             "meetNumber": 1,
            //             "eventDate": "2023-06-01T00:00:00.000Z",
            //             "googleMeetLink": "some link",
            //             "classEventType": "meet"
            //          },
            //          {
            //             "meetNumber": 2,
            //             "eventDate": "2023-06-02T00:00:00.000Z",
            //             "googleMeetLink": "some link",
            //             "classEventType": "meet"
            //          },
            //          {
            //             "meetNumber": 3,
            //             "eventDate": "2023-06-03T00:00:00.000Z",
            //             "googleMeetLink": "some link",
            //             "classEventType": "meet"
            //          },
            //          {
            //             "meetNumber": 3,
            //             "eventDate": "2023-06-05T00:00:00.000Z",
            //             "googleMeetLink": "some link",
            //             "classEventType": "expo"
            //          },
            //       ]
            //    },
            //    { 
            //       "id": 1,
            //       "courseName": "iwd1",
            //       "courseCipher": "iIWD336-6-b",
            //       "linkToClassMaterials": "http//:linkToFolderBBB",
            //       "startDate": "2023-11-12T00:00:00.000Z",
            //       "endDate": "2023-11-29T00:00:00.000Z",
            //       "participants": {
            //          "facilitators": [
            //             {
            //             "explorerId": "e1",
            //             "explorerMail": "string",
            //             "explorerPassword": "string",
            //             "discordNickname": ".dima228228",
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
            //             },
            //             {
            //                "explorerId": "e1",
            //                "explorerMail": "string",
            //                "explorerPassword": "string",
            //                "discordNickname": "string",
            //                "discordId": "",
            //                "cohort": "string",
            //                "contactInfo": {
            //                   "id": 1,
            //                   "firstName": "firstUpdated",
            //                   "lastName": "lastName",
            //                   "email": "email",
            //                   "age": 15,
            //                   "country": "country",
            //                   "timezone": "timezone",
            //                   "sourceOfReferral": "sourceOfReferral",
            //                   "eduQuestSelectedDateTime": "2023-06-08T00:00:00.000Z",
            //                   "eduQuestDecision": "Try again"
            //                }
            //                }
            //          ],
            //          "oversights": [
            //             {
            //             "explorerId": "e1",
            //             "explorerMail": "string",
            //             "explorerPassword": "string",
            //             "discordNickname": "",
            //             "discordId": "362618677306195978",
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
            //          ],
            //          "interns": [
            //             {
            //             "explorerId": "someExId",
            //             "explorerMail": "some mail",
            //             "explorerPassword": "some password",
            //             "discordNickname": "nameDisc",
            //             "discordId": "",
            //             "cohort": "cohort",
            //             "contactInfo": {
            //                "id": 5,
            //                "firstName": "firstUpdated",
            //                "lastName": "lastName",
            //                "email": "email2",
            //                "age": 15,
            //                "country": "country",
            //                "timezone": "timezone",
            //                "sourceOfReferral": "sourceOfReferral",
            //                "eduQuestSelectedDateTime": "2023-06-08T00:00:00.000Z",
            //                "eduQuestDecision": "Try again"
            //             }
            //             }
            //          ]
            //       },
            //       "schedule": [
            //          {
            //             "meetNumber": 1,
            //             "eventDate": "2023-06-01T00:00:00.000Z",
            //             "googleMeetLink": "some link",
            //             "classEventType": "meet"
            //          },
            //          {
            //             "meetNumber": 2,
            //             "eventDate": "2023-06-02T00:00:00.000Z",
            //             "googleMeetLink": "some link",
            //             "classEventType": "meet"
            //          },
            //          {
            //             "meetNumber": 3,
            //             "eventDate": "2023-06-03T00:00:00.000Z",
            //             "googleMeetLink": "some link",
            //             "classEventType": "meet"
            //          },
            //          {
            //             "meetNumber": 3,
            //             "eventDate": "2023-06-05T00:00:00.000Z",
            //             "googleMeetLink": "some link",
            //             "classEventType": "expo"
            //          },
            //       ]
            //    },
            // ]
            
            const users = await guild.members.fetch()
            let usersToEnroll: string[] = []
            let courseInfo = []
            
            for (const course of courses) {

               const facIds: string[] = []
               const ovIds: string[] = []

               for (let facilitator of course.participants.facilitators) {
                  if (facilitator.discordId) {
                     facIds.push(facilitator.discordId);
                     usersToEnroll.push(facilitator.discordId);
                  } else {
                     const member = guild.members.cache.find((member: any) => member.user.username === facilitator.discordNickname)
                     console.log(member)
                     if(member !== undefined) {
                        const fetchedUser = await guild.members.fetch(member.id)
                        console.log(fetchedUser.id)
                        facIds.push(fetchedUser.id);
                        usersToEnroll.push(fetchedUser.id);
                     }
                  }
              }
              
              if (course.participants.oversights.length > 0) {
                  for (let oversight of course.participants.oversights) {
                     if (oversight.discordId) {
                        ovIds.push(oversight.discordId);
                        usersToEnroll.push(oversight.discordId);
                     } else {
                        let member = guild.members.cache.find((member: any) => member.user.username === oversight.discordNickname);
                        if(member !== undefined) {
                           const fetchedUser = await guild.members.fetch(member.id)
                           console.log(fetchedUser.id)
                           ovIds.push(fetchedUser.id);
                           usersToEnroll.push(fetchedUser.id);
                        }
                     }
                  }
              }
               courseInfo.push({courseName: course.courseCipher, courseFacsIds: facIds, courseOvIds: ovIds, folderLink: course.linkToClassMaterials})
            }            

            console.log(courseInfo)
          
            for (const user of usersToEnroll) {
               await createdChannel.permissionOverwrites.create(user, {
                  ViewChannel: true,
               })
            }

            
            const internsRoleID = '849359196142174208' //1158116315802898503
            const internsMention = `<@&${internsRoleID}>`
            const swetaId = `852929869067452456`
            const nastyaId = `1013360130064142391`
            const yuriiId = `449205364978876446`
            const startDate = moment(courses[0].startDate).format('MMMM Do')
            const courseFullName = courses[0].courseName
            let courseMessageSections: string[] = []

            for (const info of courseInfo) {
               let facsMention = info.courseFacsIds.map(id => `<@${id}>`).join(' ');

               let courseSection = [
                   `${info.courseName}`,
                   `Facilitators: ${facsMention}`
               ];
           
               if (info.courseOvIds.length > 0) {
                   let ovsMention = info.courseOvIds.map(id => `<@${id}>`).join(' ');
                   courseSection.push(`Oversight: ${ovsMention}`);
               }
           
               courseSection.push(`Collaboration folder: ${info.folderLink}`, '');
           
               courseMessageSections.push(...courseSection);
            }

            const helloMessage = [`Hello ${internsMention}!`, 
            `From this Monday, ${startDate}, you will start your ${courseFullName} course facilitation.`,
            `All communication will be here on Discord.`,
            '',
            ...courseMessageSections,
            `Please also go through this video during your preparation`,
            `https://www.youtube.com/watch?v=cW_mHGbTks0&feature=youtu.be`,
            '',
            `Important message for facilitators⭐`,
            `If someone in your group can’t make it to class and has informed you about it, please make a note of it on the attendance and feedback sheet.`,
            `In addition, due to some circumstances, some interns might not  keep their camera on all the time, so in such cases, please leave a note about it on the attendance and feedback sheet.`,
            '',
            `If you have any problems, feel free to message or tag <@${swetaId}>🍞  or <@${yuriiId}>🍞  or <@${nastyaId}>🍞`, 
            `do share this form with your interns and encourage them to fill it out as it collects their discord ids!`,
            `https://forms.gle/DsLev9XLuPD6yGdbA`].join('\n')
            

            createdChannel.send(helloMessage)
         }
         
         return interaction.editReply({ content: `:bread: Channel ${channelName} created successfully :bread:` })
      } catch(error) {
         console.log(error)
         interaction.editReply({content: 'Something went wrong'})
      }
   }
    
};

export default facChannel