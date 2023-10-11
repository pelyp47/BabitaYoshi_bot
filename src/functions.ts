import chalk from "chalk"
import { Guild, GuildMember, PermissionFlagsBits, PermissionResolvable, TextChannel } from "discord.js"
import GuildDB from "./schemas/Guild"
import { GuildOption } from "./types"
import mongoose from "mongoose";

type colorType = "text" | "variable" | "error"

const themeColors = {
    text: "#ff8e4d",
    variable: "#ff624d",
    error: "#f5426c"
}

export const getThemeColor = (color: colorType) => Number(`0x${themeColors[color].substring(1)}`)

export const color = (color: colorType, message: any) => {
    return chalk.hex(themeColors[color])(message)
}

export const checkPermissions = (member: GuildMember, permissions: Array<PermissionResolvable>) => {
    let neededPermissions: PermissionResolvable[] = []
    permissions.forEach(permission => {
        if (!member.permissions.has(permission)) neededPermissions.push(permission)
    })
    if (neededPermissions.length === 0) return null
    return neededPermissions.map(p => {
        if (typeof p === "string") return p.split(/(?=[A-Z])/).join(" ")
        else return Object.keys(PermissionFlagsBits).find(k => Object(PermissionFlagsBits)[k] === p)?.split(/(?=[A-Z])/).join(" ")
    })
}

export const sendTimedMessage = (message: string, channel: TextChannel, duration: number) => {
    channel.send(message)
        .then(m => setTimeout(async () => (await channel.messages.fetch(m)).delete(), duration))
    return
}

export const getGuildOption = async (guild: Guild, option: GuildOption) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    let foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    return foundGuild.options[option]
}

export const setGuildOption = async (guild: Guild, option: GuildOption, value: any) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    let foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    foundGuild.options[option] = value
    foundGuild.save()
}

export function getCourseFullName(courseName: string):string {
    if(courseName.includes("IWD")) return 'Intro to Web Design'
    if(courseName.includes("PIT")) return 'Pitch and Presentation'
    if(courseName.includes("BIT")) return 'Basics of Internet Troubleshooting and Communication'
    if(courseName.includes("LED")) return 'Leadership'

    return ''
}

export function getMeetingSuffix(meetingNum: number, courseName: string): string {
    if ((courseName.includes("IWD") || courseName.includes("PIT") || courseName.includes("BIT")) && meetingNum === 4) return "EXPO"
    if (courseName.includes("LED") && meetingNum === 4) return "4th meeting"
    switch (meetingNum) {
        case 1: return "1st meeting"
        case 2: return "2nd meeting"
        case 3: return "3rd meeting"
        default: return `${meetingNum}th meeting`
    }
}

export function getLmsLink(courseName: string): string {
    if(courseName.includes("IWD")) return 'https://nobel-coaching.teachable.com/courses/intro-to-web-design'
    if(courseName.includes("PIT")) return 'https://nobel-coaching.teachable.com/courses/pitch-presentation'
    if(courseName.includes("BIT")) return 'https://nobel-coaching.teachable.com/courses/basics-of-internet'
    if(courseName.includes("LED")) return 'https://nobel-coaching.teachable.com/courses/leadership-facilitation-class'

    return ''
}