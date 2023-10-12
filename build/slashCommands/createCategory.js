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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName('create-category')
        .setDescription('Creates category')
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageChannels)
        .addStringOption(option => option.setName('category-name')
        .setDescription('Type category name')
        .setRequired(true)),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const { options, guild } = interaction;
        const category = options.getString('category-name');
        console.log(category);
        try {
            yield (guild === null || guild === void 0 ? void 0 : guild.channels.create({
                name: category,
                type: discord_js_1.ChannelType.GuildCategory
            }));
        }
        catch (error) {
            console.log(error);
        }
    })
};
exports.default = command;
