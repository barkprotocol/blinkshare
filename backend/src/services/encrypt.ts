import CryptoJS from 'crypto-js';
import env from './env';

/**
 * Encrypts the provided text using AES encryption with the key stored in the environment variable
 * @param {string} text - The text to encrypt
 * @returns {string} - The encrypted text as a string
 */
export function encryptText(text: string): string {
  if (!text) {
    throw new Error('No text provided for encryption');
  }

  try {
    return CryptoJS.AES.encrypt(text, env.ENCRYPTION_KEY).toString();
  } catch (error) {
    throw new Error('Encryption failed: ' + error.message);
  }
}

/**
 * Decrypts the provided encrypted text using AES decryption with the key stored in the environment variable
 * @param {string} encryptedText - The encrypted text to decrypt
 * @returns {string} - The decrypted plain text
 * @throws Will throw an error if decryption fails
 */
export function decryptText(encryptedText: string): string {
  if (!encryptedText) {
    throw new Error('No encrypted text provided for decryption');
  }

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, env.ENCRYPTION_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      throw new Error('Decryption failed or the text is corrupted');
    }

    return decryptedText;
  } catch (error) {
    throw new Error('Decryption failed: ' + error.message);
  }
}
