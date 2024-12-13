import { GuildMember } from 'discord.js';
import { RoleChanges } from '../../data/roleChanges';

const roleChanges = new RoleChanges();

export const guildMemberUpdateHandler = async (
    oldMember: GuildMember,
    newMember: GuildMember,
    logChannelId: string
): Promise<void> => {
    const logChannel = newMember.guild.channels.cache.get(logChannelId);

    // Compare old and new roles
    const oldRoles = oldMember.roles.cache.map((r) => r.name);
    const newRoles = newMember.roles.cache.map((r) => r.name);

    if (oldRoles.length !== newRoles.length) {
        const addedRoles = newRoles.filter((r) => !oldRoles.includes(r));
        const removedRoles = oldRoles.filter((r) => !newRoles.includes(r));
        const now = new Date().toISOString();

        // Log added roles to the database
        for (const role of addedRoles) {
            try {
                await roleChanges.addRoleChange({
                    user_id: newMember.id,
                    username: newMember.user.tag,
                    role,
                    action: 'added',
                    timestamp: now
                });
                console.log(`Logged role addition: ${role} for ${newMember.user.tag}`);
            } catch (error) {
                console.error(`Error logging role addition for ${role}: ${error}`);
            }
        }

        // Log removed roles to the database
        for (const role of removedRoles) {
            try {
                await roleChanges.addRoleChange({
                    user_id: newMember.id,
                    username: newMember.user.tag,
                    role,
                    action: 'removed',
                    timestamp: now
                });
                console.log(`Logged role removal: ${role} for ${newMember.user.tag}`);
            } catch (error) {
                console.error(`Error logging role removal for ${role}: ${error}`);
            }
        }

        // Log changes to the specified log channel
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
