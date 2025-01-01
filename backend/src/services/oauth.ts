import axios from 'axios';
import qs from 'querystring';
import env from '../services/env';

// Initialize the Discord API client
export const discordApi = axios.create({ baseURL: 'https://discord.com/api/v10' });

/**
 * Function to get the Discord access token using the authorization code
 * @param {string} code - The OAuth2 authorization code received after the user authenticates
 * @returns {Promise<Object>} - The access token and other details from Discord's API
 */
export async function getDiscordAccessToken(code: string) {
  const { data } = await discordApi.post(
    '/oauth2/token',
    qs.stringify({
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code.toString(),
      redirect_uri: env.DISCORD_REDIRECT_URI,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  );
  return data;
}

/**
 * Sends a log message to a specific Discord channel
 * @param {string} channelId - The Discord channel ID where the message will be sent
 * @param {string} title - The title of the embedded log message
 * @param {string} description - The description or body of the embedded log message
 */
export async function sendDiscordLogMessage(channelId: string, title: string, description: string) {
  try {
    await discordApi.post(
      `/channels/${channelId}/messages`,
      {
        embeds: [
          {
            color: 0x61d1aa, // Green color for the log embed
            title, // Title of the embed
            description, // Description of the log message
            timestamp: new Date().toISOString(), // Current timestamp
          },
        ],
      },
      { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } }, // Using Bot token for authentication
    );
  } catch (err) {
    console.error(`Error sending log message: ${err}`); // Log the error if sending the message fails
  }
}
