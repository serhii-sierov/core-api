import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// eslint-disable-next-line import/no-cycle -- Circular dependency inevitable here
import { IdentityEntity } from './identity.entity';
import { SessionEntity } from './session.entity';

@ObjectType()
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password?: string; // For local users

  @OneToMany(() => IdentityEntity, identity => identity.user, { cascade: true })
  @Field(() => [IdentityEntity])
  identities: IdentityEntity[];

  @OneToMany(() => SessionEntity, session => session.user, { cascade: true })
  @Field(() => [SessionEntity])
  sessions: SessionEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field()
  updatedAt: Date;
}
