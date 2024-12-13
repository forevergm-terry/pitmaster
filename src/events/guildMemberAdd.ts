import { GuildMember } from 'discord.js';
import db from '../database';

export const guildMemberAddHandler = async (member: GuildMember, logChannelId: string, roleName: string): Promise<void> => {
    const logChannel = member.guild.channels.cache.get(logChannelId);

    // Add role and log to database
    const role = member.guild.roles.cache.find(r => r.name === roleName);
    if (role) {
        try {
            await member.roles.add(role);
            console.log(`Assigned role "${roleName}" to ${member.user.tag}`);

            if (logChannel?.isTextBased()) {
                logChannel.send(`🎉 **${member.user.tag}** joined and was assigned the "${roleName}" role.`);
            }

            const now = new Date().toISOString();
            db.run(
                `INSERT INTO user_history (user_id, username, joined_at) VALUES (?, ?, ?)`,
                [member.id, member.user.tag, now],
                (err) => {
                    if (err) {
                        console.error('Error logging new user to database:', err.message);
                    }
                }
            );
        } catch (error) {
            console.error(`Failed to assign role: ${error}`);
        }
    }
};
