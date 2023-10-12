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
const functions_1 = require("../functions");
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
dotenv_1.default.config();
const command = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName('create-channel')
        .setDescription('Creates a channel')
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
        .addStringOption(option => option.setName('course-name')
        .setDescription('Create channel category')
        .setRequired(true)),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const { guild, options } = interaction;
        const { ViewChannel } = discord_js_1.PermissionFlagsBits;
        const channelCategory = options.getChannel('category-name');
        const channelType = options.getString('channel-type');
        const channelName = options.getString('channel-name');
        const isPrivate = options.getBoolean('private');
        const courseNameCipher = options.getString('course-name');
        console.log(courseNameCipher);
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
                const headers = {
                    "Api-Token": `${process.env.API_TOKEN}`
                };
                const course = yield axios_1.default.get(`https://dune-abundant-candle.glitch.me/api/courses/${courseNameCipher}/details`, { headers }).then(response => {
                    return response.data;
                });
                console.log(course);
                const startDate = (0, moment_1.default)(course.startDate).format("MMMM Do");
                let schedule = [];
                if (course.schedule.length > 0) {
                    schedule = course.schedule.map((meeting, index) => {
                        const formattedDate = (0, moment_1.default)(meeting.eventDate).format("MMMM Do");
                        const meetingSuffix = (0, functions_1.getMeetingSuffix)(index + 1, courseNameCipher);
                        return `${formattedDate} - ${meetingSuffix}`;
                    });
                }
                else {
                    throw Error('Schedule is emtpy');
                }
                const participants = course.participants;
                let usersToEnroll = [];
                if (participants.length > 0) {
                    participants.oversights.map((oversight) => {
                        usersToEnroll.push({ role: 'o', nickName: oversight.discordNickname, userId: oversight.discordId || '' });
                    });
                    participants.facilitators.map((facilitator) => {
                        usersToEnroll.push({ role: 'f', nickName: facilitator.discordNickname, userId: facilitator.discordId || '' });
                    });
                    participants.interns.map((intern) => {
                        usersToEnroll.push({ role: 'i', nickName: intern.discordNickname, userId: intern.discordId || '' });
                    });
                }
                else {
                    throw Error('Participants is empty');
                }
                console.log(usersToEnroll);
                const users = yield guild.members.fetch();
                let facilitatorIds = [];
                let oversightsIds = [];
                for (const user of usersToEnroll) {
                    let member;
                    if (user.userId) {
                        member = guild.members.cache.get(user.userId);
                    }
                    else {
                        member = guild.members.cache.find((member) => member.user.username === user.nickName);
                    }
                    if (member) {
                        const fetchedUser = yield guild.members.fetch(member.id);
                        if (fetchedUser) {
                            yield createdChannel.permissionOverwrites.create(fetchedUser, {
                                ViewChannel: true,
                            });
                            if (user.role === 'o') {
                                oversightsIds.push(fetchedUser.id);
                            }
                            else if (user.role === 'f') {
                                facilitatorIds.push(fetchedUser.id);
                            }
                        }
                    }
                }
                console.log(facilitatorIds);
                const courseFullName = course.courseName;
                let oversightStr = '';
                if (oversightsIds.length > 0) {
                    oversightStr = `Oversight: ${oversightsIds.map(id => `<@${id}>`).join(', ')}`;
                }
                const internsRoleID = '849359196142174208';
                const internsMention = `<@&${internsRoleID}>`;
                const lmsLink = (0, functions_1.getLmsLink)(courseNameCipher);
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
        }
        catch (error) {
            console.log(error);
            interaction.editReply({ content: `${error}` });
        }
    })
};
exports.default = command;
