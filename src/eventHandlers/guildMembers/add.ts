import { GuildMember } from 'discord.js';
import { Users } from '../../data/users';

const users = new Users();

export const guildMemberAddHandler = async (member: GuildMember, logChannelId: string, roleName: string): Promise<void> => {
    const logChannel = member.guild.channels.cache.get(logChannelId);

    // Find the role
    const role = member.guild.roles.cache.find((r) => r.name === roleName);
    if (!role) {
        console.error(`Role "${roleName}" not found.`);
        return;
    }

    try {
        // Add role to the new member
        await member.roles.add(role);
        console.log(`Assigned role "${roleName}" to ${member.user.tag}`);

        // Log to the specified log channel
        if (logChannel?.isTextBased()) {
            logChannel.send(`🎉 **${member.user.tag}** joined and was assigned the "${roleName}" role.`);
        }

        // Add user to the database
        const now = new Date().toISOString();
        const existingUser = await users.getUserById(member.id);

        if (!existingUser) {
            // New user: Add to the users table
            await users.addUser({
                user_id: member.id,
                username: member.user.tag,
                first_joined_at: now
            });
        }

        // Log the join event in the user history
        await users.logUserEvent({
            user_id: member.id,
            event_type: 'join',
            event_timestamp: now
        });

        console.log(`Logged join event for user: ${member.user.tag}`);
    } catch (error) {
        console.error(`Error handling guild member add: ${error}`);
    }
};
