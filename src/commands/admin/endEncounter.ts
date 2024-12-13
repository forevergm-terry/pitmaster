import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { EncounterService } from '../../services/encounterService';
import { PermissionsService } from '../../services/permissionsService';

const encounterService = new EncounterService();
const permissionsService = new PermissionsService();

export const endEncounter = {
    data: new SlashCommandBuilder()
        .setName('endencounter')
        .setDescription('End the current combat encounter in this channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: any) {
        await interaction.deferReply();

        const channel = interaction.channel;

        if (!channel.isTextBased()) {
            return interaction.followUp('This command can only be used in text channels.');
        }

        try {
            // Check if an encounter exists in the channel
            const encounter = await encounterService.getEncounter(channel.id);
            if (!encounter) {
                return interaction.followUp('No active encounter in this channel.');
            }

            // End the encounter
            await encounterService.endEncounter(channel.id);

            // Reset channel permissions
            await permissionsService.resetChannelPermissions(channel);

            await interaction.followUp('Combat encounter ended. Channel permissions restored.');
        } catch (error) {
            console.error('Error ending encounter:', error);
            await interaction.followUp(`Failed to end encounter: ${error}`);
        }
    }
};
