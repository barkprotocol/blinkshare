import { Entity, Column, CreateDateColumn, PrimaryColumn, Index } from 'typeorm';

enum WalletType {
  GENERATED = 1,  // Wallet generated programmatically by the system
  IMPORTED = 2,   // Wallet imported by the user
  EMBEDDED = 3,   // Wallet embedded with the user's account (e.g., through some integration)
}

@Entity()
@Index('discord_user_idx', ['discordUserId'])
export class Wallet {
  constructor(address: string, discordUserId: string) {
    this.address = address;
    this.discordUserId = discordUserId;
    this.type = WalletType.EMBEDDED; // Default type set to EMBEDDED
  }

  /**
   * Public address of the wallet
   * This address should be unique and used to identify the wallet
   */
  @PrimaryColumn({ type: 'varchar', unique: true })
  address: string;

  /**
   * Discord ID of the user who owns the wallet
   * This links the wallet to a Discord user
   */
  @Column({ type: 'varchar' })
  discordUserId: string;

  /**
   * Encrypted private key for this wallet
   * This should be handled with extra security to prevent data exposure.
   * Ensure encryption at rest, and proper decryption only when necessary.
   */
  @Column({ type: 'varchar', nullable: true })
  privateKey: string;

  /**
   * Type of the wallet based on how it was created
   * This is an ENUM and should only contain one of the predefined values (GENERATED, IMPORTED, EMBEDDED).
   */
  @Column({ type: 'enum', enum: WalletType })
  type: WalletType;

  /**
   * Timestamp when the wallet was created
   * This is automatically set when the wallet record is created.
   */
  @CreateDateColumn()
  createTime: Date;
}
