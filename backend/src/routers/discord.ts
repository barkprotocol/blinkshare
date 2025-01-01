import express, { Request, Response } from 'express';
import {
  createUserWallet,
  findAllGuildIdsSortedByCreateTime,
  findGuildById,
  getSubscriptionsByGuildId,
  insertGuild,
  updateGuild,
} from '../database/database';
import { Guild } from '../database/entities/guild';
import env from '../services/env';
import { discordApi } from '../services/oauth';
import { verifySignature, verifyJwt, checkGuildOwnership } from '../middleware/auth';
import { PrivyClient } from '@privy-io/server-auth';

export const discordRouter = express.Router();

/**
 * Get all guilds from the database
 * @returns {Guild[]}
 */
discordRouter.get('/guilds', async (req: Request, res: Response) => {
  try {
    const guildIds = await findAllGuildIdsSortedByCreateTime();
    return res.json(guildIds);
  } catch (error) {
    console.error('Error fetching guild IDs', error);
    return res.status(500).json({ error: `Failed to get guilds: ${error.message}` });
  }
});

/**
 * Creates a new guild in the database
 * The wallet signature is verified to ensure the user owns the wallet.
 * @param {string} address - Wallet address of the user
 * @param {Guild} data - Guild data to be stored
 * @returns {Guild}
 */
discordRouter.post('/guilds', [verifyJwt, verifySignature], async (req: Request, res: Response) => {
  const { address, data } = req.body;

  if (!data.name || !data.roles?.length) {
    return res.status(400).send({ error: 'Invalid guild data provided' });
  }

  data.address = address;

  // Validate Solana address format
  const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  if (!solanaAddressRegex.test(address)) {
    return res.status(400).send({ error: 'Invalid Solana wallet address format' });
  }

  try {
    await insertGuild(new Guild(data));
    console.info(`Guild ${data.id} inserted successfully`);
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error saving guild', error);
    return res.status(500).json({ error: `Failed to save guild: ${error.message}` });
  }
});

/**
 * Get a guild by its ID from the database
 * @param {string} guildId - ID of the guild
 * @returns {Guild}
 */
discordRouter.get('/guilds/:guildId', [verifyJwt, checkGuildOwnership], async (req: Request, res: Response) => {
  const guildId = req.params.guildId;

  try {
    const guild = await findGuildById(guildId);
    if (!guild) {
      return res.status(404).send('Guild not found');
    }
    return res.json({ guild });
  } catch (error) {
    console.error('Error fetching guild', error);
    return res.status(500).json({ error: `Failed to get guild: ${error.message}` });
  }
});

/**
 * Updates an existing guild
 * @param {string} guildId - ID of the guild to update
 * @param {string} address - Solana wallet address
 * @param {Guild} data - Updated guild data
 * @returns {Guild}
 */
discordRouter.put(
  '/guilds/:guildId',
  [verifyJwt, verifySignature, checkGuildOwnership],
  async (req: Request, res: Response) => {
    const { address, data } = req.body;
    const guildId = req.params.guildId;

    try {
      const guild = await findGuildById(guildId);
      if (!guild) return res.status(404).send('Guild not found');

      // Validate Solana address format
      const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
      if (!solanaAddressRegex.test(address)) {
        return res.status(400).send({ error: 'Invalid Solana wallet address format' });
      }

      data.address = address;
      console.info(`Updating guild: ${JSON.stringify(data)}`);

      await updateGuild(guildId, data);
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error updating guild', error);
      return res.status(500).json({ error: `Failed to update guild: ${error.message}` });
    }
  },
);

/**
 * Fetches the roles of a guild through the API with Bot credentials
 * @param {string} guildId - ID of the guild
 * @returns {Array} Roles and position of the Blinkord role
 */
discordRouter.get('/guilds/:guildId/roles', [verifyJwt, checkGuildOwnership], async (req: Request, res: Response) => {
  const guildId = req.params.guildId;

  try {
    const { data: roles } = await discordApi.get(`/guilds/${guildId}/roles`, {
      headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
    });

    console.info(`Fetched ${roles.length} roles for guild ${guildId}`);

    const blinkordRolePosition = roles.find((r) => r.tags?.bot_id === env.DISCORD_CLIENT_ID)?.position;

    return res.json({
      roles: roles
        .filter((r) => !r.managed && r.name !== '@everyone')
        .sort((a, b) => b.position - a.position)
        .map(({ id, name, position }) => ({ id, name, position })),
      blinkordRolePosition,
    });
  } catch (error) {
    console.error('Error fetching server roles', error);
    return res.status(500).json({ error: `Unable to get server roles: ${error.message}` });
  }
});

/**
 * Get all subscriptions for a guild
 * @param {string} guildId - ID of the guild
 * @returns {Array} Subscriptions of the guild
 */
discordRouter.get(
  '/guilds/:guildId/subscriptions',
  [verifyJwt, checkGuildOwnership],
  async (req: Request, res: Response) => {
    const guildId = req.params.guildId;

    try {
      const subscriptions = await getSubscriptionsByGuildId(guildId);
      return res.json(subscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions', error);
      return res.status(500).json({ error: `Unable to get subscriptions: ${error.message}` });
    }
  },
);

/**
 * Fetches all channels for a guild
 * @param {string} guildId - ID of the guild
 * @returns {Array} List of text channels
 */
discordRouter.get(
  '/guilds/:guildId/channels',
  [verifyJwt, checkGuildOwnership],
  async (req: Request, res: Response) => {
    const guildId = req.params.guildId;

    try {
      const { data: channels } = await discordApi.get(`/guilds/${guildId}/channels`, {
        headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
      });

      console.info(`Fetched ${channels.length} channels for guild ${guildId}`);

      const textChannels = channels.filter((channel) => channel.type === 0); // Type 0 represents text channels
      return res.json(textChannels.map(({ id, name }) => ({ id, name })));
    } catch (error) {
      console.error('Error fetching server channels', error);
      return res.status(500).json({ error: `Unable to get server channels: ${error.message}` });
    }
  },
);

/**
 * Creates an embedded wallet for a Discord user
 * @param {string} discordUserId - Discord user ID
 * @param {string} address - Solana wallet address
 */
discordRouter.post('/embedded-wallet', [], async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    if (!accessToken) {
      return res.status(401).json({ error: 'Authorization token missing' });
    }

    await new PrivyClient(env.PRIVY_APP_ID, env.PRIVY_APP_SECRET).verifyAuthToken(accessToken);
  } catch (error) {
    console.error(`Token verification failed: ${error}`);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { discordUserId, address } = req.body;

  if (!discordUserId || !address) {
    return res.status(400).json({ error: 'discordUserId and address are required' });
  }

  // Validate Solana address format
  const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  if (!solanaAddressRegex.test(address)) {
    return res.status(400).json({ error: 'Invalid Solana wallet address format' });
  }

  try {
    const wallet = await createUserWallet(discordUserId, address);
    return res.status(201).json(wallet);
  } catch (error) {
    console.error('Error creating embedded wallet', error);
    return res.status(500).json({ error: 'Failed to create embedded wallet' });
  }
});
