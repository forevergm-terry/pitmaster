const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// Log when the bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Assign role to new members
client.on('guildMemberAdd', async (member) => {
    const roleName = 'fresh meat'; 
    const role = member.guild.roles.cache.find(r => r.name === roleName);

    if (role) {
        try {
            await member.roles.add(role);
            console.log(`Assigned role "${roleName}" to ${member.user.tag}`);
        } catch (error) {
            console.error(`Failed to assign role: ${error.message}`);
        }
    } else {
        console.error(`Role "${roleName}" not found`);
    }
});

// Log in the bot
client.login(process.env.DISCORD_TOKEN);
