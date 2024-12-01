import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { UserEntity } from 'modules/user/entities/user.entity';

@ObjectType()
@Entity()
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => Int)
  userId: number;

  @ManyToOne(() => UserEntity, user => user.refreshTokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  @Field(() => UserEntity)
  user: UserEntity;

  @Column({ unique: true })
  token: string; // The refresh token value

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable: true })
  ipAddress?: string;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  location?: string | null;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  device?: string | null;

  @Column({ type: 'timestamptz' })
  @Field()
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field()
  updatedAt: Date;
}
