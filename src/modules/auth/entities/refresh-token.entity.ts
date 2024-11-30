import { Field, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { UserEntity } from 'modules/user/entities/user.entity';

@ObjectType()
@Entity()
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  userId: number;

  @ManyToOne(() => UserEntity, user => user.refreshTokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  @Field(() => UserEntity)
  user: UserEntity;

  @Column({ unique: true })
  @Field()
  token: string; // The refresh token value

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable: true })
  device?: string; // The name of the device the token is associated with

  @Column({ type: 'timestamptz' })
  @Field()
  expiresAt: Date; // Expiry date of the refresh token

  @CreateDateColumn({ type: 'timestamptz' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field()
  updatedAt: Date;
}
