import { client } from './client';
import { guildMemberAddHandler, guildMemberRemoveHandler, guildMemberUpdateHandler } from './eventHandlers/guildMembers';
import {startEncounter, endEncounter} from './commands/admin';
import dotenv from 'dotenv';
import { initializeTables } from './data/db/tables';

initializeTables();
dotenv.config();

const LOG_CHANNEL_ID = '1317008399292174448';
const DEFAULT_ROLE_NAME = 'fresh meat';

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

client.on('guildMemberAdd', (member) => {
    guildMemberAddHandler(member, LOG_CHANNEL_ID, DEFAULT_ROLE_NAME);
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
    guildMemberUpdateHandler(oldMember as any, newMember as any, LOG_CHANNEL_ID);
});

client.on('guildMemberRemove', (member) => {
    guildMemberRemoveHandler(member, LOG_CHANNEL_ID);
});

client.on('ready', async () => {
    const guild = client.guilds.cache.first();
    if (guild) {
        await guild.commands.create(startEncounter.data.toJSON());
        await guild.commands.create(endEncounter.data.toJSON());
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    try {
        if (commandName === 'startencounter') {
            await startEncounter.execute(interaction);
        } else if (commandName === 'endencounter') {
            await endEncounter.execute(interaction);
        }
    } catch (error) {
        console.error(`Error executing ${commandName} command:`, error);
        if (interaction.deferred || interaction.replied) {
            await interaction.followUp({ content: 'There was an error while executing this command.' });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
        }
    }
});


client.login(process.env.DISCORD_TOKEN);