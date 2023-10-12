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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createCohort = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName('create-cohort-channel')
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
        .addStringOption(option => option.setName('cohort-name')
        .setDescription('Create channel category')
        .setRequired(true)),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const { guild, options } = interaction;
        const { ViewChannel } = discord_js_1.PermissionFlagsBits;
        const channelCategory = options.getChannel('category-name');
        const channelType = options.getString('channel-type');
        const channelName = options.getString('channel-name');
        const isPrivate = options.getBoolean('private');
        const cohortName = options.getString('cohort-name');
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
                const cohort = yield axios_1.default.get(`https://dune-abundant-candle.glitch.me/api/interns?cohort=${cohortName}`, { headers }).then(response => {
                    return response.data;
                });
                console.log(cohort);
                let usersToEnroll = [];
                cohort.map((user) => {
                    usersToEnroll.push({ nickName: user.discordNickname, userId: user.discordId });
                });
                const users = yield guild.members.fetch();
                console.log(users.map((user) => {
                    return { id: user.user.id, nick: user.user.username };
                }));
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
                        }
                    }
                }
                const internsRoleID = '849359196142174208';
                const internsMention = `<@&${internsRoleID}>`;
                const helloMessage = [`Hello ${internsMention}!`,
                    '',
                    `⭐ This channel will be used for updating new information for your cohort and a way to keep in touch with everyone😄 `,
                    '',
                    `You can also ask any questions you have regarding the internship here!💥`,].join('\n');
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
exports.default = createCohort;
