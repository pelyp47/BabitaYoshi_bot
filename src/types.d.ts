import { SlashCommandBuilder, CommandInteraction, Collection, PermissionResolvable, Message, AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js"
import mongoose from "mongoose"

export interface SlashCommand {
    command: SlashCommandBuilder,
    execute: (interaction : ChatInputCommandInteraction) => void,
    autocomplete?: (interaction: AutocompleteInteraction) => void,
    cooldown?: number // in seconds
}

export interface Command {
    name: string,
    execute: (message: Message, args: Array<string>) => void,
    permissions: Array<PermissionResolvable>,
    aliases: Array<string>,
    cooldown?: number,
}

interface GuildOptions {
    prefix: string,
}

export interface IGuild extends mongoose.Document {
    guildID: string,
    options: GuildOptions
    joinedAt: Date
}

export type GuildOption = keyof GuildOptions
export interface BotEvent {
    name: string,
    once?: boolean | false,
    execute: (...args?) => void
}


declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string,
            CLIENT_ID: string,
            PREFIX: string,
            MONGO_URI: string,
            MONGO_DATABASE_NAME: string
        }
    }
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
        commands: Collection<string, Command>,
        cooldowns: Collection<string, number>
    }
}

export type DiscordUser = {
    role: string
    nickName: string
    userId: string | ''
}

export type ScheduleEvent = {
    id: number
    eventDate: string | ""
    eventName: string
    cohort: string
}

export type UserToEnroll = {
    nickName: string
    userId: string | ''
}
export type FacToEnroll = {
    role: string
    course: string
    nickName: string
    userId: string | ''
}

export interface Meeting {
    meetNum: string;
    eventDate: string;
    meetingLink: string;
    eventtype: string;
 };

 export interface contactInfo {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    country: string;
    timezone: string;
    sourceOfReferral: string;
    eduQuestSelectedDateTime: string; 
    eduQuestDecision: string;
 };
 export interface Participant {
    explorerId: string;
    explorerMail: string;
    explorerPassword: string;
    discordNickname: string;
    discordId?: string;
    cohort: string;
    contactInfo: ContactInfo;
};

export interface Course {
    id: number;
    courseName: string;
    courseCipher: string;
    linkToClassMaterials: string;
    startDate: string;
    endDate: string;
    participants: {
        facilitators: Participant[];
        oversights: Participant[];
        interns: Participant[];
    };
    schedule: Schedule[];
}