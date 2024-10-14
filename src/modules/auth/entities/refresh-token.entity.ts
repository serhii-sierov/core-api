import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { UserEntity } from 'modules/user/entities/user.entity';

@Entity()
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, user => user.refreshTokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  user: UserEntity;

  @Column({ unique: true })
  token: string; // The refresh token value

  @Column({ type: 'varchar', nullable: true })
  device?: string | null; // The name of the device the token is associated with

  @Column({ type: 'timestamptz' })
  expiresAt: Date; // Expiry date of the refresh token

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
