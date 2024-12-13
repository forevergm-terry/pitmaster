const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ]
});

// Define the channel ID for logging
const LOG_CHANNEL_ID = '1317008399292174448';

// Bot ready event
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Log new members joining
client.on('guildMemberAdd', async (member) => {
    const roleName = 'fresh meat';
    const role = member.guild.roles.cache.find(r => r.name === roleName);

    const logChannel = member.guild.channels.cache.get(LOG_CHANNEL_ID);

    if (role) {
        try {
            await member.roles.add(role);
            console.log(`Assigned role "${roleName}" to ${member.user.tag}`);
            if (logChannel) {
                logChannel.send(`:tada: **${member.user.tag}** joined and was assigned the "${roleName}" role.`);
            }
        } catch (error) {
            console.error(`Failed to assign role: ${error.message}`);
            if (logChannel) {
                logChannel.send(`:warning: Failed to assign role "${roleName}" to **${member.user.tag}**: ${error.message}`);
            }
        }
    } else {
        console.error(`Role "${roleName}" not found`);
        if (logChannel) {
            logChannel.send(`:warning: Role "${roleName}" not found when **${member.user.tag}** joined.`);
        }
    }
});

// Log role updates
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const logChannel = newMember.guild.channels.cache.get(LOG_CHANNEL_ID);

    // Check if roles have changed
    const oldRoles = oldMember.roles.cache.map(r => r.name);
    const newRoles = newMember.roles.cache.map(r => r.name);

    if (oldRoles.length !== newRoles.length) {
        const addedRoles = newRoles.filter(r => !oldRoles.includes(r));
        const removedRoles = oldRoles.filter(r => !newRoles.includes(r));

        if (logChannel) {
            if (addedRoles.length > 0) {
                logChannel.send(`:white_check_mark: **${newMember.user.tag}** was given the role(s): ${addedRoles.join(', ')}`);
            }
            if (removedRoles.length > 0) {
                logChannel.send(`:x: **${newMember.user.tag}** had the role(s) removed: ${removedRoles.join(', ')}`);
            }
        }
    }
});

// Bot login
client.login(process.env.DISCORD_TOKEN);
