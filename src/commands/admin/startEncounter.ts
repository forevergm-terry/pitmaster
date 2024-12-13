import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { encounterManager } from '../../systems/encounterManager';
import { restrictChannel } from '../../systems/permissionsManager';

export const startEncounter = {
    data: new SlashCommandBuilder()
        .setName('startencounter')
        .setDescription('Start a combat encounter in this channel.')
        .addUserOption(option =>
            option.setName('player')
                .setDescription('The active player for this encounter.')
                .setRequired(true)
        ).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: any) {
        const channel = interaction.channel;
        const player = interaction.options.getUser('player');

        if (!channel.isTextBased()) {
            return interaction.reply('This command can only be used in text channels.');
        }

        // Start the encounter
        const encounter = encounterManager.startEncounter(
            channel.id,
            player.id,
            [] // Spectators can be added later
        );

        // Restrict channel access
        await restrictChannel(channel, player.id);

        return interaction.reply(
            `Combat encounter started! Active player: ${player.tag}`
        );
    }
};
