// src/modules/auth/entities/password-reset-token.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';

@Entity('password_reset_tokens')
@Index('pr_user_active_idx', ['userId', 'usedAt']) // for invalidateActiveTokens(userId, usedAt IS NULL)
export class PasswordResetToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  // store ONLY the hash
  @Index({ unique: true })
  @Column({ type: 'char', length: 64 }) // hex sha256 => 64 chars
  tokenHash!: string;

  @Index()
  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  @Index()
  @Column({ type: 'timestamptz', nullable: true })
  usedAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Column({ type: 'varchar', length: 45, nullable: true }) // IPv4/IPv6 textual fits; adjust if you like
  ip?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent?: string;
}
