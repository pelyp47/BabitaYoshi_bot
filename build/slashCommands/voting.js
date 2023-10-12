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
        .setName("voting")
        .addStringOption(option => {
        return option
            .setName("title")
            .setDescription("Title of the poll")
            .setRequired(true);
    })
        .setDescription("Create a new poll"),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const modal = new discord_js_1.ModalBuilder()
            .setCustomId('pollmodal')
            .setTitle("Create a new poll");
        let actionRows = [];
        for (let i = 1; i <= 5; i++) {
            const optionInput = new discord_js_1.TextInputBuilder()
                .setCustomId(`optioninput${i}`)
                .setLabel(`Option ${i}`)
                .setStyle(discord_js_1.TextInputStyle.Short);
            const actionRow = new discord_js_1.ActionRowBuilder().addComponents(optionInput);
            actionRows.push(actionRow);
        }
        modal.addComponents(actionRows);
        interaction.showModal(modal);
    }),
    cooldown: 10
};
exports.default = command;
