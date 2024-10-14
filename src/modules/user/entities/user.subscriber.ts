import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

import { UserEntity } from './user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): void {
    event.entity.email = event.entity.email.toLowerCase();
  }

  beforeUpdate(event: UpdateEvent<UserEntity>): void {
    if (event.entity?.email) {
      event.entity.email = (event.entity as UserEntity).email.toLowerCase();
    }
  }
}
