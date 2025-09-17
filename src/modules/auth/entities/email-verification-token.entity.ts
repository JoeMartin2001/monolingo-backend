// src/modules/auth/entities/email-verification-token.entity.ts
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
import { TableName } from 'src/common/constants/TableName';

@Entity(TableName.EMAIL_VERIFICATION_TOKENS)
@Index('ev_user_active_idx', ['userId', 'usedAt']) // for invalidateActiveTokens(userId, usedAt IS NULL)
export class EmailVerificationToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Index({ unique: true })
  @Column({ type: 'char', length: 64 }) // sha256 hex
  tokenHash!: string;

  @Index()
  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  @Index()
  @Column({ type: 'timestamptz', nullable: true })
  usedAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent?: string;
}
