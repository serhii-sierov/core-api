import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { UserEntity } from 'modules/user/entities/user.entity';

// eslint-disable-next-line import/no-cycle -- Circular dependency inevitable here
import { IdentityEntity } from './identity.entity';

@ObjectType()
@Entity('sessions')
export class SessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', { unique: true })
  @Field(() => String)
  sessionId: string;

  @Column()
  @Field(() => Int)
  userId: number;

  @Column()
  @Field(() => Int)
  identityId: number;

  @ManyToOne(() => IdentityEntity, identity => identity.sessions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  @Field(() => IdentityEntity)
  identity: IdentityEntity;

  @ManyToOne(() => UserEntity, user => user.sessions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  @Field(() => UserEntity)
  user: UserEntity;

  // JWT ID
  @Column({ unique: true })
  jtiHash: string;

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
