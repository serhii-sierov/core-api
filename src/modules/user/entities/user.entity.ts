import { Field, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { RefreshTokenEntity } from 'modules/auth/entities/refresh-token.entity';

// eslint-disable-next-line import/no-cycle -- Circular dependency inevitable here
import { ProviderEntity } from './provider.entity';

@ObjectType()
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable: true })
  password?: string; // For local users

  @OneToMany(() => ProviderEntity, provider => provider.user, { cascade: true })
  @Field(() => [ProviderEntity])
  providers: ProviderEntity[]; // Linked OAuth providers

  @OneToMany(() => RefreshTokenEntity, refreshToken => refreshToken.user, { cascade: true })
  @Field(() => [RefreshTokenEntity])
  refreshTokens: RefreshTokenEntity[]; // Associated refresh tokens

  @CreateDateColumn({ type: 'timestamptz' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field()
  updatedAt: Date;
}
