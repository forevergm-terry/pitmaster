import { GuildMember, PartialGuildMember, TextChannel } from 'discord.js';
import { Users } from '../../data/users';

const users = new Users();

export const guildMemberRemoveHandler = async (
    member: GuildMember | PartialGuildMember,
    logChannelId: string
): Promise<void> => {
    const logChannel = member.guild.channels.cache.get(logChannelId) as TextChannel;

    // Fallbacks for partial members
    const userId = member.id;
    const username = member.user?.tag || 'Unknown User';
    const now = new Date().toISOString();

    try {
        // Log leave event in the user history
        await users.logUserEvent({
            user_id: userId,
            event_type: 'leave',
            event_timestamp: now
        });

        console.log(`Logged leave event for user: ${username}`);

        // Log to channel
        if (logChannel?.isTextBased()) {
            logChannel.send(`:wave: **${username}** has left the server.`);
        }
    } catch (error) {
        console.error(`Error handling guild member remove: ${error}`);
    }
};
