import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { EncounterService } from '../../services/encounterService';
import { PermissionsService } from '../../services/permissionsService';

const encounterService = new EncounterService();
const permissionsService = new PermissionsService();

export const startEncounter = {
    data: new SlashCommandBuilder()
        .setName('startencounter')
        .setDescription('Start a combat encounter in this channel.')
        .addUserOption((option) =>
            option
                .setName('player')
                .setDescription('The active player for this encounter.')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: any) {
        await interaction.deferReply();

        const channel = interaction.channel;
        const player = interaction.options.getUser('player');

        if (!channel.isTextBased()) {
            return interaction.followUp('This command can only be used in text channels.');
        }

        try {
            // Start the encounter
            const encounter = await encounterService.startEncounter(channel.id, player.id);

            // Restrict channel access
            await permissionsService.restrictChannel(channel, player.id);

            await interaction.followUp(
                `Combat encounter started! Active player: ${player.tag} in channel: ${channel.name}`
            );
        } catch (error) {
            console.error('Error starting encounter:', error);
            await interaction.followUp(`Failed to start encounter: ${error}`);
        }
    }
};
