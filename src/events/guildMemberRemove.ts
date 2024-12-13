import { GuildMember, PartialGuildMember, TextChannel } from 'discord.js';
import db from '../database';

export const guildMemberRemoveHandler = async (
    member: GuildMember | PartialGuildMember,
    logChannelId: string
): Promise<void> => {
    const logChannel = member.guild.channels.cache.get(logChannelId) as TextChannel;

    // Fallbacks for partial members
    const userId = member.id;
    const username = member.user?.tag || 'Unknown User';
    const now = new Date().toISOString();

    // Log to database
    db.run(
        `UPDATE user_history SET left_at = ? WHERE user_id = ?`,
        [now, userId],
        (err) => {
            if (err) {
                console.error('Error updating member removal in database:', err.message);
            }
        }
    );

    // Log to channel
    if (logChannel?.isTextBased()) {
        logChannel.send(`:wave: **${username}** has left the server.`);
    }
};
