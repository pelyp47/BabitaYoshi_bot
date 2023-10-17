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
        .setName('delete-channel')
        .setDescription('Delete a discord channel')
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageChannels)
        .addChannelOption(option => option.setName('channel')
        .setDescription('Select the channel you want to delete')
        .setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const { options } = interaction;
            const channel = options.getChannel('channel');
            try {
                yield interaction.deferReply({ ephemeral: true });
                yield channel.delete();
                yield interaction.editReply({ content: `Channel deleted successfully` });
            }
            catch (error) {
                console.log(error);
            }
        });
    },
    cooldown: 10
};
exports.default = command;
