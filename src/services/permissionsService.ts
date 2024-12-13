import { TextChannel } from 'discord.js';

export class PermissionsService {
    async restrictChannel(channel: TextChannel, activePlayerId: string): Promise<void> {
        const everyoneRole = channel.guild.roles.everyone;

        // Restrict permissions for everyone except the active player
        await channel.permissionOverwrites.set([
            {
                id: everyoneRole.id,
                deny: ['SendMessages']
            },
            {
                id: activePlayerId,
                allow: ['SendMessages']
            }
        ]);
    }

    async resetChannelPermissions(channel: TextChannel): Promise<void> {
        // Reset channel permissions to default
        await channel.permissionOverwrites.set([]);
    }
}