import 'dotenv/config';

// Define the keys for the environment variables as a constant array
const envKeys = [
  'NODE_ENV',
  'DISCORD_BOT_TOKEN',
  'DISCORD_CLIENT_ID',
  'DISCORD_CLIENT_SECRET',
  'DISCORD_REDIRECT_URI',
  'APP_BASE_URL',
  'SOLANA_RPC_URL',
  'JWT_SECRET',
  'DATABASE_HOST',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'BLINKSIGHTS_API_KEY',
  'ENCRYPTION_KEY',
  'TREASURY_ADDRESS',
  'PRIVY_APP_ID',
  'PRIVY_APP_SECRET',
] as const;

// Initialize the env object using a dynamic mapping based on env keys
const env = envKeys.reduce(
  (acc, key) => {
    // Assign the environment variable value or `undefined` if it's missing
    acc[key] = process.env[key] || undefined;
    return acc;
  },
  {} as Record<(typeof envKeys)[number], string | undefined>,
);

// Optional: Log missing environment variables for debugging, but only in development mode
if (process.env.NODE_ENV === 'development') {
  envKeys.forEach((key) => {
    if (!process.env[key]) {
      console.warn(`Warning: Missing environment variable ${key}`);
    }
  });
}

// Example of validation: Ensure critical variables are set
const requiredEnvKeys = [
  'DISCORD_BOT_TOKEN',
  'SOLANA_RPC_URL',
  'JWT_SECRET',
  'DATABASE_HOST',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
] as const;

requiredEnvKeys.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Critical environment variable missing: ${key}`);
  }
});

export default env;
