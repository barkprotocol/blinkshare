import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getAllGuilds, saveNewAccessToken as saveAccessToken } from '../database/database';
import env from '../services/env';
import { discordApi, getDiscordAccessToken } from '../services/oauth';
import { AccessToken } from '../database/entities/access-token';
import { encryptText } from '../services/encrypt';

export const loginRouter = express.Router();

/**
 * Returns a Discord OAuth URL for logging in
 * @param {boolean} owner - If the login is done by a server owner or member, based on client-side context. Leave empty if not owner.
 * @returns { url: string }
 */
loginRouter.get('/', (req: Request, res: Response) => {
  const clientId = env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(env.DISCORD_REDIRECT_URI || '');  // Ensure redirect URI is properly encoded
  const isJoin = req.query.owner ? '' : '.join';  // Adjust scope for join functionality
  
  return res.json({
    url: `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify+guilds${isJoin}`,
  });
});

/**
 * Callback after an owner has logged in. Returns a JWT token with the user's id, username, and guild IDs they are owner/admin of
 * @param {string} code - Query param with OAuth grant code provided after completing discord OAuth flow
 * @returns { token: string, userId: string, username: string, guilds: Guild[]}
 */
loginRouter.get('/callback', async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const { access_token, expires_in } = await getDiscordAccessToken(code);
    console.info(`Login access token obtained, fetching user profile and guild data...`);

    const { data: user } = await discordApi.get('/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // Handle non-owner users
    if (!req.query.owner) {
      const expiresAt = new Date(Date.now() + expires_in * 1000);
      await saveAccessToken(
        new AccessToken({
          discordUserId: user.id,
          code,
          token: encryptText(access_token),
          expiresAt,
        }),
      );

      return res.json({ success: true });
    }

    // Handle owner users
    const getGuilds = async (Authorization: string) => {
      const { data: guilds } = await discordApi.get('/users/@me/guilds', {
        headers: { Authorization },
      });
      return guilds;
    };

    const userGuilds = await getGuilds(`Bearer ${access_token}`);
    const botGuilds = await getGuilds(`Bot ${env.DISCORD_BOT_TOKEN}`);

    const ownerOrAdminGuilds = userGuilds.filter((guild: any) => guild.owner || (guild.permissions & 0x8) === 0x8);
    const guildIds = ownerOrAdminGuilds.map((guild: any) => guild.id);

    console.info(`Successfully fetched user guilds, ${ownerOrAdminGuilds.length} in total.`);

    // Generate JWT for the user
    const userId = user.id;
    const username = user.username;
    const token = jwt.sign({ userId, username, guildIds }, env.JWT_SECRET, { expiresIn: '1d' });

    const allGuilds = await getAllGuilds();

    // Prepare and return guild information
    return res.json({
      token,
      userId,
      username,
      guilds: ownerOrAdminGuilds.map(({ id, name, icon }) => ({
        id,
        name,
        image: icon ? `https://cdn.discordapp.com/icons/${id}/${icon}.png` : null,
        hasBot: botGuilds.some((g) => g.id === id),
        created: allGuilds.some((g) => g.id === id),
      })),
    });
  } catch (err) {
    console.error(`Error during OAuth callback: ${err.message || err}`);
    res.status(500).json({ error: 'Failed to complete the authentication process' });
  }
});
