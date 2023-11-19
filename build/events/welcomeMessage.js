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
const event = {
    name: 'guildMemberAdd',
    execute: (member) => __awaiter(void 0, void 0, void 0, function* () {
        const websiteLink = 'https://nobelnavigators.com/';
        const talkTimeLink = 'https://chrome.google.com/webstore/detail/talk-time-for-google-meet/bclhnknpopffhkpodghagpcekbmljclh';
        const linktreeLink = 'https://linktr.ee/your_internship';
        const TikTokLink = 'https://www.tiktok.com/@nobel.community';
        const instaLink = 'https://www.instagram.com/nobel.community/';
        const discordFeedbackLink = 'https://forms.gle/s3mTgHuoAuzzFXuE7';
        try {
            const message = [
                `Welcome to the World of Nobel, ${member.displayName}! 🌟`,
                "",
                `We're thrilled to have you join our community. Here, you'll find valuable resources and opportunities to grow.`,
                "",
                `🔗 Useful Links:`,
                `- LinkTree: ${linktreeLink}`,
                `- Talk Time Extension: ${talkTimeLink} (Extension for browser that we use to give badges during the class!)`,
                `- Our Website: ${websiteLink}`,
                "",
                `🤖 Using the Bot:`,
                `Our server bot is here to assist you! Try out these commands in any server chat:`,
                `- \`/my-schedule\` to get your schedule.`,
                `- \`/send-linktree\` for quick access to important links.`,
                `- \`/leave-feedback\` to share your thoughts and ideas.`,
                "",
                `💡 We're constantly evolving, and your feedback about the bot is invaluable. If you have ideas for new bot features or improvements, please submit them using this form: ${discordFeedbackLink}.`,
                "",
                `👥 Follow us on social media:`,
                `- TikTok: ${TikTokLink}`,
                `-, Instagram: ${instaLink}`,
                "",
                `Happy learning and collaborating!`,
                "",
                `Welcome aboard! 🚀`,
            ].join('\n');
            yield member.send(message);
        }
        catch (error) {
            console.error('Failed to send a DM to the member: ', error);
        }
    }),
};
exports.default = event;
