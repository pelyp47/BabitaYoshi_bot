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
        .setName("schedule")
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageChannels)
        .addStringOption(option => {
        return option
            .setName("cohort")
            .setDescription("Your cohort")
            .setRequired(true);
    })
        .setDescription("Your Internship schedule."),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield interaction.deferReply({ ephemeral: true });
            const cohort = interaction.options.getString("cohort");
            const user = interaction.user;
            user.send(`Here is your schedule: ${cohort}`);
            return interaction.editReply({ content: "Your schedule was successfully sent in private messages." });
        }
        catch (error) {
            interaction.editReply({ content: "Something went wrong..." });
        }
    }),
    cooldown: 10
};
exports.default = command;
