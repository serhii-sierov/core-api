import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// eslint-disable-next-line import/no-cycle -- Circular dependency inevitable here
import { UserEntity } from './user.entity';

@Entity('providers')
export class ProviderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, user => user.providers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  user: UserEntity;

  @Column()
  provider: string; // E.g., 'google', 'facebook'

  @Column()
  providerId: string; // Unique ID from the OAuth provider
}
