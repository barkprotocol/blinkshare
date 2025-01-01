import { Entity, Column, PrimaryColumn, Index } from 'typeorm';
import { BaseEntity } from './base-entity';
import crypto from 'crypto';
import env from '../services/env';

const ALGORITHM = 'aes-256-cbc'; // AES encryption algorithm
const ENCRYPTION_KEY = env.ENCRYPTION_KEY; // Secure key stored in env, should be 32 bytes
const IV_LENGTH = 16; // AES block size for CBC mode

/**
 * Used to store discord access tokens when assigning roles to a user
 * Access token has a longer lifetime, while grant code has just 1 minute
 * For safety, store access token (encrypted), in case the user purchase flow takes more than 1 minute
 */
@Entity()
@Index('discord_user_idx', ['discordUserId'])
@Index('code_idx', ['code'])
export class AccessToken extends BaseEntity<AccessToken> {
  @PrimaryColumn({ type: 'varchar', unique: true, length: 255 })
  code: string;

  @Column({ type: 'varchar', length: 50 })
  discordUserId: string;

  @Column({ type: 'varchar', length: 500 })
  token: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  /**
   * Encrypt the token using AES-256-CBC
   * @param {string} token - The token to encrypt
   * @returns {string} - The encrypted token
   */
  static encryptToken(token: string): string {
    try {
      const iv = crypto.randomBytes(IV_LENGTH); // Generate random IV
      const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
      let encrypted = cipher.update(token, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
      throw new Error('Failed to encrypt token');
    }
  }

  /**
   * Decrypt the token using AES-256-CBC
   * @param {string} encryptedToken - The encrypted token
   * @returns {string} - The decrypted token
   */
  static decryptToken(encryptedToken: string): string {
    try {
      const [ivHex, encrypted] = encryptedToken.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      throw new Error('Failed to decrypt token');
    }
  }

  /**
   * Check if the token has expired
   * @returns {boolean} - Returns true if the token is expired, false otherwise
   */
  isExpired(): boolean {
    const now = new Date();
    return now > this.expiresAt;
  }
}
