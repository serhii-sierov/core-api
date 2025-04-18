import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

// eslint-disable-next-line import/no-cycle -- Circular dependency inevitable here
import { SessionEntity } from './session.entity';
// eslint-disable-next-line import/no-cycle -- Circular dependency inevitable here
import { UserEntity } from './user.entity';

import { IdentityProvider } from '../types';

@ObjectType()
@Entity('identities')
@Unique(['provider', 'providerId'])
export class IdentityEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => Int)
  userId: number;

  @ManyToOne(() => UserEntity, user => user.identities, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  @Field(() => UserEntity)
  user: UserEntity;

  @Column()
  @Field()
  provider: IdentityProvider;

  @Column()
  @Field()
  providerId: string; // Unique ID from the OAuth provider

  @OneToMany(() => SessionEntity, session => session.identity)
  @Field(() => [SessionEntity])
  sessions: SessionEntity[];
}
