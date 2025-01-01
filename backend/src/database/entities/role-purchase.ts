import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Guild } from './guild';
import { Role } from './role';
import { BaseEntity } from './base-entity';

@Entity()
export class RolePurchase extends BaseEntity<RolePurchase> {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Discord ID of the user purchaser
   */
  @Column({ type: 'varchar' })
  discordUserId: string;

  @ManyToOne(() => Guild, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'guildId' })
  guild: Guild;

  @ManyToOne(() => Role, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  /**
   * If role is limited time only, this is when it expires
   */
  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  /**
   * Signature of the payment transaction
   */
  @Column({ type: 'varchar', nullable: true })
  signature: string;

  /**
   * Calculates the expiration time based on the guild's role time limit settings
   * 
   * This method uses the guild's `limitedTimeUnit` and `limitedTimeQuantity` 
   * to calculate when the purchased role should expire.
   * Supported units: Hours, Days, Weeks, Months.
   * 
   * @returns {RolePurchase} - The updated RolePurchase instance with the calculated `expiresAt` date.
   * @throws {Error} If the time unit is unsupported or missing required information.
   */
  setExpiresAt(): RolePurchase {
    const { limitedTimeUnit, limitedTimeQuantity, limitedTimeRoles } = this.guild;

    // Ensure the guild has a valid `limitedTimeRoles` property and time settings
    if (!limitedTimeRoles || !limitedTimeUnit || !limitedTimeQuantity) {
      throw new Error('Guild does not have valid time settings for limited roles');
    }

    const now = new Date();

    // Calculate expiration date based on the unit and quantity
    switch (limitedTimeUnit) {
      case 'Hours':
        now.setHours(now.getHours() + +limitedTimeQuantity);
        break;
      case 'Days':
        now.setDate(now.getDate() + +limitedTimeQuantity);
        break;
      case 'Weeks':
        now.setDate(now.getDate() + +limitedTimeQuantity * 7);
        break;
      case 'Months':
        now.setMonth(now.getMonth() + +limitedTimeQuantity);
        break;
      default:
        throw new Error(`Unsupported time unit: ${limitedTimeUnit}`);
    }

    this.expiresAt = now;
    return this;
  }
}
