import {
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Connection,
    TransactionMessage,
    VersionedTransaction,
    TransactionInstruction,
} from '@solana/web3.js';
import { Guild } from '../database/entities/guild';
import nacl from 'tweetnacl';
import { decodeUTF8 } from 'tweetnacl-util';
import env from './env';
import { createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token';

/**
 * Generates a transaction for sending either SOL or USDC from the sender's wallet to the guild's wallet.
 * Includes tracking instructions if provided.
 * @param {string} from - The sender's public key.
 * @param {number} amount - The amount of SOL to send.
 * @param {Guild} guild - The guild to which the funds will be sent.
 * @param {TransactionInstruction} trackingInstruction - Optional tracking instruction to add to the transaction.
 * @returns {Promise<VersionedTransaction>} - The constructed transaction.
 */
export async function generateSendTransaction(
    from: string,
    amount: number,
    guild: Guild,
    trackingInstruction?: TransactionInstruction,
): Promise<VersionedTransaction> {
    const fromPubkey = new PublicKey(from);
    const toPubKey = new PublicKey(guild.address);

    const lamports = amount * LAMPORTS_PER_SOL;

    // Ensure the sender has enough SOL if transferring SOL
    if (!guild.useUsdc && lamports > (await getSolBalance(from))) {
        throw new Error('Insufficient SOL balance.');
    }

    const connection = new Connection(env.SOLANA_RPC_URL);
    const { blockhash } = await connection.getLatestBlockhash();

    // Choose the appropriate instructions based on the guild's currency preference (SOL or USDC)
    const instructions = guild.useUsdc
        ? await getTransferUsdcInstructions(fromPubkey, toPubKey, lamports)
        : getTransferSolInstructions(fromPubkey, toPubKey, lamports);

    if (trackingInstruction) instructions.push(trackingInstruction);

    // Construct and return the VersionedTransaction
    return new VersionedTransaction(
        new TransactionMessage({
            payerKey: fromPubkey,
            recentBlockhash: blockhash,
            instructions,
        }).compileToV0Message(),
    );
}

/**
 * Verifies whether a given signature matches the message for the specified address.
 * @param {string} address - The public key of the sender (in base58 format).
 * @param {string} message - The message to verify.
 * @param {string} signature - The signature to verify (in base64 format).
 * @returns {boolean} - Whether the signature is valid for the message and address.
 */
export function isCorrectSignature(address: string, message: string, signature: string): boolean {
    if (!message || !address || !signature) return false;

    try {
        return nacl.sign.detached.verify(
            decodeUTF8(message),
            Buffer.from(signature, 'base64'),
            new PublicKey(address).toBytes(),
        );
    } catch (err) {
        console.error(`Error verifying wallet signature: ${err}`);
        return false;
    }
}

/**
 * Creates the transfer instructions for USDC, including token account lookup.
 * @param {PublicKey} fromPubkey - The sender's public key.
 * @param {PublicKey} toPubKey - The recipient's public key (guild).
 * @param {number} lamports - The amount of lamports to transfer (USDC is in a smaller unit).
 * @returns {Promise<TransactionInstruction[]>} - The instructions for transferring USDC.
 */
async function getTransferUsdcInstructions(
    fromPubkey: PublicKey,
    toPubKey: PublicKey,
    lamports: number,
): Promise<TransactionInstruction[]> {
    const mintAddress = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC mint address

    // Get or create associated token accounts for sender and recipient
    const fromTokenAccount = await getAssociatedTokenAddress(mintAddress, fromPubkey);
    const toTokenAccount = await getAssociatedTokenAddress(mintAddress, toPubKey);

    // Adjust lamports for USDC decimals (6 decimals for USDC, 9 for SOL)
    lamports /= 10 ** 3;

    return [createTransferInstruction(fromTokenAccount, toTokenAccount, fromPubkey, lamports)];
}

/**
 * Creates the transfer instructions for SOL, including a 2% fee to the treasury.
 * @param {PublicKey} fromPubkey - The sender's public key.
 * @param {PublicKey} toPubkey - The recipient's public key (guild).
 * @param {number} lamports - The amount of lamports to transfer (SOL).
 * @returns {TransactionInstruction[]} - The instructions for transferring SOL.
 */
function getTransferSolInstructions(
    fromPubkey: PublicKey,
    toPubkey: PublicKey,
    lamports: number,
): TransactionInstruction[] {
    const treasuryLamports = Math.floor(lamports * 0.02); // 2% fee to the treasury
    const recipientLamports = lamports - treasuryLamports;

    // Transfer to the recipient
    const recipientInstruction = SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: recipientLamports,
    });

    // Transfer 2% to the treasury
    const treasuryInstruction = SystemProgram.transfer({
        fromPubkey,
        toPubkey: new PublicKey(env.TREASURY_ADDRESS),
        lamports: treasuryLamports,
    });

    return [recipientInstruction, treasuryInstruction];
}

/**
 * Checks if a transaction has been confirmed on the Solana blockchain.
 * Returns false if confirmation takes longer than 30 seconds or an error occurs.
 * @param {string} txId - The transaction ID to confirm.
 * @returns {Promise<boolean>} - Whether the transaction was confirmed successfully.
 */
export async function isTxConfirmed(txId: string): Promise<boolean> {
    if (!txId) return false;
    console.info(`Confirming transaction ${txId}...`);

    const connection = new Connection(env.SOLANA_RPC_URL, 'processed');
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    return Promise.race([
        connection
            .confirmTransaction({ blockhash, lastValidBlockHeight, signature: txId }, 'confirmed')
            .then((conf) => !conf.value.err),
        new Promise((resolve) => setTimeout(resolve, 30_000, false)), // Timeout after 30 seconds
    ])
        .then((result) => result !== false)
        .catch(() => false); // Return false if there's an error during confirmation
}

/**
 * Gets the SOL balance of a given public key.
 * @param {string} publicKey - The public key of the wallet to check.
 * @returns {Promise<number>} - The balance of the wallet in lamports.
 */
export async function getSolBalance(publicKey: string): Promise<number> {
    const connection = new Connection(env.SOLANA_RPC_URL, 'confirmed');
    return await connection.getBalance(new PublicKey(publicKey));
}
