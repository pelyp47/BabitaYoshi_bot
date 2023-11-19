// import { GuildMember } from 'discord.js';
// import { BotEvent } from '../types';

// const event: BotEvent = {
//   name: 'guildMemberAdd',
//   execute: async (member: GuildMember) => {
//     const websiteLink = 'https://nobelnavigators.com/';
//     const talkTimeLink = 'https://chrome.google.com/webstore/detail/talk-time-for-google-meet/bclhnknpopffhkpodghagpcekbmljclh';
//     const linktreeLink = 'https://linktr.ee/your_internship';
//     const TikTokLink = 'https://www.tiktok.com/@nobel.community';
//     const instaLink = 'https://www.instagram.com/nobel.community/';
//     const discordFeedbackLink = 'https://forms.gle/s3mTgHuoAuzzFXuE7';
//     // const generalFeedbackLink = '';
//     try {

//     const message = [
//       `Welcome to the World of Nobel, ${member.displayName}! 🌟`,
//       "",
//       `We're thrilled to have you join our community. Here, you'll find valuable resources and opportunities to grow.`,
//       "",
//       `🔗 Useful Links:`,
//       `- LinkTree: ${linktreeLink}`,
//       `- Talk Time Extension: ${talkTimeLink} (Extension for browser that we use to give badges during the class!)`,
//       `- Our Website: ${websiteLink}`,
//       "",
//       `🤖 Using the Bot:`,
//       `Our server bot is here to assist you! Try out these commands in any server chat:`,
//       `- \`/my-schedule\` to get your schedule.`,
//       `- \`/send-linktree\` for quick access to important links.`,
//       `- \`/leave-feedback\` to share your thoughts and ideas.`,
//       "",
//       `💡 We're constantly evolving, and your feedback about the bot is invaluable. If you have ideas for new bot features or improvements, please submit them using this form: ${discordFeedbackLink}.`,
//       "",
//       `👥 Follow us on social media:`,
//       `- TikTok: ${TikTokLink}`,
//       `-, Instagram: ${instaLink}`,
//       "",
//       `Happy learning and collaborating!`,
//       "",
//       `Welcome aboard! 🚀`,
//       ].join('\n');
//       await member.send(message);
//     } catch (error) {
//       console.error('Failed to send a DM to the member: ', error);
//     }
//   },
// };

// export default event;

import { GuildMember } from 'discord.js';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildMemberAdd',
  execute: async (member: GuildMember) => {
    const websiteLink = 'https://nobelnavigators.com/';
    const talkTimeLink = 'https://chrome.google.com/webstore/detail/talk-time-for-google-meet/bclhnknpopffhkpodghagpcekbmljclh';
    const linktreeLink = 'https://linktr.ee/your_internship';
    const TikTokLink = 'https://www.tiktok.com/@nobel.community';
    const instaLink = 'https://www.instagram.com/nobel.community/';
    const discordFeedbackLink = 'https://forms.gle/s3mTgHuoAuzzFXuE7';

    try {
      // Check if the member can receive DMs
      if (member.user.dmChannel) {
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

        await member.send(message);
      } else {
        console.warn(`Failed to send a DM to ${member.displayName}: User has DMs disabled.`);
      }
    } catch (error) {
      console.error(`Failed to send a DM to ${member.displayName}: `, error);
    }
  },
};

export default event;
