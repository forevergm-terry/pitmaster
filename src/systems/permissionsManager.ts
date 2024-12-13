import { TextChannel } from 'discord.js';

export async function restrictChannel(
    channel: TextChannel,
    activePlayerId: string
): Promise<void> {
    const everyoneRole = channel.guild.roles.everyone;

    // Make the channel read-only for everyone except the active player
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

export async function resetChannelPermissions(channel: TextChannel): Promise<void> {
    // Reset channel permissions to default
    await channel.permissionOverwrites.set([]);
}
