import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// eslint-disable-next-line import/no-cycle -- Circular dependency inevitable here
import { UserEntity } from './user.entity';

@ObjectType()
@Entity('providers')
export class ProviderEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  userId: number;

  @ManyToOne(() => UserEntity, user => user.providers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  @Field(() => UserEntity)
  user: UserEntity;

  @Column()
  @Field()
  provider: string; // E.g., 'google', 'facebook'

  @Column()
  @Field()
  providerId: string; // Unique ID from the OAuth provider
}
