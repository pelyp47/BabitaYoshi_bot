"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const facChannel = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName('create-facilitator-channel')
        .setDescription('Creates a cohort channel')
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageChannels)
        .addChannelOption(option => option.setName('category-name')
        .setDescription('Choose channel Category')
        .addChannelTypes(discord_js_1.ChannelType.GuildCategory)
        .setRequired(true))
        .addStringOption(option => option.setName('channel-type')
        .setDescription('Set the type of the channel')
        .addChoices({ name: 'Text channel', value: 'textchannel' }, { name: 'Voice channel', value: 'voicechannel' })
        .setRequired(true))
        .addStringOption(option => option.setName('channel-name')
        .setDescription('Create channel category')
        .setRequired(true))
        .addBooleanOption(option => option.setName('private')
        .setDescription('Should the channel be private?')
        .setRequired(true))
        .addStringOption(option => option.setName('courses-name')
        .setDescription('Create channel category')
        .setRequired(true)),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const { guild, options } = interaction;
        const { ViewChannel } = discord_js_1.PermissionFlagsBits;
        const channelCategory = options.getChannel('category-name');
        const channelType = options.getString('channel-type');
        const channelName = options.getString('channel-name');
        const isPrivate = options.getBoolean('private');
        const inputCourses = options.getString('courses-name');
        const coursesArray = inputCourses.trim().split(',');
        console.log(coursesArray);
        try {
            yield interaction.deferReply({ ephemeral: true });
            const permissions = isPrivate ? [{
                    id: guild === null || guild === void 0 ? void 0 : guild.roles.everyone.id,
                    deny: [ViewChannel]
                }] : [];
            let createdChannel;
            if (channelType === 'textchannel') {
                createdChannel = yield (guild === null || guild === void 0 ? void 0 : guild.channels.create({
                    name: channelName,
                    type: discord_js_1.ChannelType.GuildText,
                    parent: channelCategory,
                    permissionOverwrites: permissions
                }));
            }
            if (channelType === 'voicechannel') {
                createdChannel = yield (guild === null || guild === void 0 ? void 0 : guild.channels.create({
                    name: channelName,
                    type: discord_js_1.ChannelType.GuildVoice,
                    parent: channelCategory,
                    permissionOverwrites: permissions
                }));
            }
            if (isPrivate && channelType === 'textchannel') {
                const courses = [];
                const headers = {
                    "Api-Token": `${process.env.API_TOKEN}`
                };
                for (const course of coursesArray) {
                    yield axios_1.default.get(`https://dune-abundant-candle.glitch.me/api/courses/${course}/details`, { headers }).then(response => {
                        courses.push(response.data);
                        return response.data;
                    });
                }
                console.log(courses);
                const users = yield guild.members.fetch();
                let usersToEnroll = [];
                let courseInfo = [];
                for (const course of courses) {
                    const facIds = [];
                    const ovIds = [];
                    for (let facilitator of course.participants.facilitators) {
                        if (facilitator.discordId) {
                            facIds.push(facilitator.discordId);
                            usersToEnroll.push(facilitator.discordId);
                        }
                        else {
                            const member = guild.members.cache.find((member) => member.user.username === facilitator.discordNickname);
                            console.log(member);
                            if (member !== undefined) {
                                const fetchedUser = yield guild.members.fetch(member.id);
                                console.log(fetchedUser.id);
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
                            }
                            else {
                                let member = guild.members.cache.find((member) => member.user.username === oversight.discordNickname);
                                if (member !== undefined) {
                                    const fetchedUser = yield guild.members.fetch(member.id);
                                    console.log(fetchedUser.id);
                                    ovIds.push(fetchedUser.id);
                                    usersToEnroll.push(fetchedUser.id);
                                }
                            }
                        }
                    }
                    courseInfo.push({ courseName: course.courseCipher, courseFacsIds: facIds, courseOvIds: ovIds, folderLink: course.linkToClassMaterials });
                }
                console.log(courseInfo);
                for (const user of usersToEnroll) {
                    yield createdChannel.permissionOverwrites.create(user, {
                        ViewChannel: true,
                    });
                }
                const internsRoleID = '849359196142174208';
                const internsMention = `<@&${internsRoleID}>`;
                const swetaId = `852929869067452456`;
                const nastyaId = `1013360130064142391`;
                const yuriiId = `449205364978876446`;
                const startDate = (0, moment_1.default)(courses[0].startDate).format('MMMM Do');
                const courseFullName = courses[0].courseName;
                let courseMessageSections = [];
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
                    `https://forms.gle/DsLev9XLuPD6yGdbA`].join('\n');
                createdChannel.send(helloMessage);
            }
            return interaction.editReply({ content: `:bread: Channel ${channelName} created successfully :bread:` });
        }
        catch (error) {
            console.log(error);
            interaction.editReply({ content: 'Something went wrong' });
        }
    })
};
exports.default = facChannel;
