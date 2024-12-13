import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { encounterManager } from '../../systems/encounterManager';
import { resetChannelPermissions } from '../../systems/permissionsManager';

export const endEncounter = {
    data: new SlashCommandBuilder()
        .setName('endencounter')
        .setDescription('End the current combat encounter in this channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: any) {
        const channel = interaction.channel;

        if (!channel.isTextBased()) {
            return interaction.reply('This command can only be used in text channels.');
        }

        const encounter = encounterManager.getEncounter(channel.id);
        if (!encounter) {
            return interaction.reply('No active encounter in this channel.');
        }

        // End the encounter and reset permissions
        encounterManager.endEncounter(channel.id);
        await resetChannelPermissions(channel);

        return interaction.reply('Combat encounter ended. Channel permissions restored.');
    }
};
