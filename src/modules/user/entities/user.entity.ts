import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { RefreshTokenEntity } from 'modules/auth/entities/refresh-token.entity';

// eslint-disable-next-line import/no-cycle -- Circular dependency inevitable here
import { ProviderEntity } from './provider.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string | null; // For local users

  @OneToMany(() => ProviderEntity, provider => provider.user, { cascade: true })
  providers: ProviderEntity[]; // Linked OAuth providers

  @OneToMany(() => RefreshTokenEntity, refreshToken => refreshToken.user, { cascade: true })
  refreshTokens: RefreshTokenEntity[]; // Associated refresh tokens

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
