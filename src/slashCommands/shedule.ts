import { SlashCommandBuilder } from "discord.js";
import { SlashCommand, ScheduleEvent } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("my-schedule")
        .addStringOption(option => option
            .setName("explorerid")
            .setDescription("Input your explorer ID")
            .setRequired(true)
        )
        .setDescription("Sends internship schedule."),

    execute: async (interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true });
            const user = interaction.user;
            const explorerId = interaction.options.getString("explorerid")?.trim();

            const response = await fetch(`https://dune-abundant-candle.glitch.me/api/interns/${explorerId}/cohort-schedule`);
            const schedule = await response.json();

            const closestFutureEvent = schedule.reduce((closestEvent: ScheduleEvent, currentEvent: ScheduleEvent) => {
                const currentDate = new Date();
                const currentEventDate = new Date(currentEvent.eventDate);
            
                return (currentEventDate > currentDate && (closestEvent === null || currentEventDate < new Date(closestEvent.eventDate)))
                    ? currentEvent
                    : closestEvent;
            }, null);
            
            const userSchedule = schedule.map((event: ScheduleEvent, index: number) => {
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
            
            const userScheduleWithSpaces = userSchedule.map((event: any, index: number) => {
                return (index === 0)
                    ? event
                    : ((index - 2) % 4 === 0)
                        ? '\n' + event
                        : "      " + event;
            });
            
            const scheduleMessage = `👋 Hey there! Here's what's coming up for you. 👈  This checkmark indicates the closest event for you.\n\n${userScheduleWithSpaces.join('\n')}`;
            
            user.send(scheduleMessage);

            return interaction.editReply({ content: "Your schedule was successfully sent in private messages." });
        } catch (error) {
            interaction.editReply({ content: "Something went wrong..." });
        }
    },
    cooldown: 10
};

export default command;
