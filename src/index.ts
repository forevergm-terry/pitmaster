import { client } from './client';
import { guildMemberAddHandler } from './events/guildMemberAdd';
import { guildMemberUpdateHandler } from './events/guildMemberUpdate';
import dotenv from 'dotenv';

dotenv.config();

const LOG_CHANNEL_ID = '1317008399292174448';
const DEFAULT_ROLE_NAME = 'fresh meat';

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

client.on('guildMemberAdd', (member) => {
    guildMemberAddHandler(member, LOG_CHANNEL_ID, DEFAULT_ROLE_NAME);
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
    guildMemberUpdateHandler(oldMember as any, newMember as any, LOG_CHANNEL_ID);
});

client.login(process.env.DISCORD_TOKEN);