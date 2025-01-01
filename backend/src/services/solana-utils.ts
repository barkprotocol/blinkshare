import { Connection, PublicKey, Transaction, Keypair, sendAndConfirmTransaction } from '@solana/web3.js';

// Connect to Solana network
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// Utility function to create a new keypair
export const createKeypair = () => {
  const keypair = Keypair.generate();
  return keypair;
};

// Get balance for a wallet
export const getBalance = async (walletAddress: PublicKey) => {
  try {
    const balance = await connection.getBalance(walletAddress);
    return balance;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
};

// Send SOL from one account to another
export const sendSOL = async (fromKeypair: Keypair, toPublicKey: PublicKey, lamports: number) => {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toPublicKey,
      lamports,
    })
  );

  try {
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
    return signature;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
};
