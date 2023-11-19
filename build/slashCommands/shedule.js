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
        .setName("my-schedule")
        .addStringOption(option => option
        .setName("explorerid")
        .setDescription("Input your explorer ID")
        .setRequired(true))
        .setDescription("Sends internship schedule."),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            yield interaction.deferReply({ ephemeral: true });
            const user = interaction.user;
            const explorerId = (_a = interaction.options.getString("explorerid")) === null || _a === void 0 ? void 0 : _a.trim();
            const response = yield fetch(`https://dune-abundant-candle.glitch.me/api/interns/${explorerId}/cohort-schedule`);
            const schedule = yield response.json();
            const closestFutureEvent = schedule.reduce((closestEvent, currentEvent) => {
                const currentDate = new Date();
                const currentEventDate = new Date(currentEvent.eventDate);
                return (currentEventDate > currentDate && (closestEvent === null || currentEventDate < new Date(closestEvent.eventDate)))
                    ? currentEvent
                    : closestEvent;
            }, null);
            const userSchedule = schedule.map((event, index) => {
                const formattedDate = event.eventDate
                    ? new Date(event.eventDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })
                    : "Will share dates later";
                const emojis = ((index - 2) % 4 === 0 || index === 0)
                    ? '🗓'
                    : '';
                const eventDisplay = `${emojis}  **${formattedDate}:**  ${event.eventName}`;
                return (event === closestFutureEvent)
                    ? `${eventDisplay}  👈`
                    : eventDisplay;
            });
            const userScheduleWithSpaces = userSchedule.map((event, index) => {
                return (index === 0)
                    ? event
                    : ((index - 2) % 4 === 0)
                        ? '\n' + event
                        : "      " + event;
            });
            const scheduleMessage = `👋 Hey there! Here's what's coming up for you. 👈  This checkmark indicates the closest event for you.\n\n${userScheduleWithSpaces.join('\n')}`;
            user.send(scheduleMessage);
            return interaction.editReply({ content: "Your schedule was successfully sent in private messages." });
        }
        catch (error) {
            interaction.editReply({ content: "Something went wrong..." });
        }
    }),
    cooldown: 10
};
exports.default = command;
