import { Entity, Column, ManyToOne, PrimaryColumn, UpdateDateColumn, Index } from 'typeorm';
import { Guild } from './guild';
import { BaseEntity } from './base-entity';

@Entity()
@Index('role_name_idx', ['name'])
@Index('guild_id_idx', ['guild'])
export class Role extends BaseEntity<Role> {
  /**
   * Discord role ID
   */
  @PrimaryColumn({ type: 'varchar', unique: true })
  id: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  /**
   * Amount of Solana this role costs
   */
  @Column('decimal', { precision: 9, scale: 5, default: 0 })
  amount: number;

  @ManyToOne(() => Guild, (guild) => guild.roles, { nullable: false, onDelete: 'CASCADE' })
  guild: Guild;

  @UpdateDateColumn()
  updateTime: Date;
}
