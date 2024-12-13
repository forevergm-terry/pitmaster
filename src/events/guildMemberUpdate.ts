import { GuildMember } from 'discord.js';
import db from '../database';

export const guildMemberUpdateHandler = async (oldMember: GuildMember, newMember: GuildMember, logChannelId: string): Promise<void> => {
    const logChannel = newMember.guild.channels.cache.get(logChannelId);

    const oldRoles = oldMember.roles.cache.map(r => r.name);
    const newRoles = newMember.roles.cache.map(r => r.name);

    if (oldRoles.length !== newRoles.length) {
        const addedRoles = newRoles.filter(r => !oldRoles.includes(r));
        const removedRoles = oldRoles.filter(r => !newRoles.includes(r));
        const now = new Date().toISOString();

        addedRoles.forEach((role) => {
            db.run(
                `INSERT INTO role_changes (user_id, username, role, action, timestamp) VALUES (?, ?, ?, ?, ?)`,
                [newMember.id, newMember.user.tag, role, 'added', now],
                (err) => {
                    if (err) {
                        console.error('Error logging role addition to database:', err.message);
                    }
                }
            );
        });

        removedRoles.forEach((role) => {
            db.run(
                `INSERT INTO role_changes (user_id, username, role, action, timestamp) VALUES (?, ?, ?, ?, ?)`,
                [newMember.id, newMember.user.tag, role, 'removed', now],
                (err) => {
                    if (err) {
                        console.error('Error logging role removal to database:', err.message);
                    }
                }
            );
        });

        if (logChannel?.isTextBased()) {
            if (addedRoles.length > 0) {
                logChannel.send(`✅ **${newMember.user.tag}** was given the role(s): ${addedRoles.join(', ')}`);
            }
            if (removedRoles.length > 0) {
                logChannel.send(`❌ **${newMember.user.tag}** had the role(s) removed: ${removedRoles.join(', ')}`);
            }
        }
    }
};
