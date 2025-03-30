import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, LessThan, Repository } from 'typeorm';

import { SessionEntity } from 'modules/user/entities';
import { Create, Destroy, Exists, FindAll, FindOne, FindOneOrFail, Update, Upsert } from 'types';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  private getRepository(manager?: EntityManager): Repository<SessionEntity> {
    return manager ? manager.getRepository(SessionEntity) : this.sessionRepository;
  }

  exists: Exists<SessionEntity> = (options, transactionManager) => {
    const repository = this.getRepository(transactionManager);

    return repository.exists(options);
  };

  findOne: FindOne<SessionEntity> = (options, transactionManager) => {
    const repository = this.getRepository(transactionManager);

    return repository.findOne(options);
  };

  findOneOrFail: FindOneOrFail<SessionEntity> = (options, transactionManager) => {
    const repository = this.getRepository(transactionManager);

    return repository.findOneOrFail(options);
  };

  findAll: FindAll<SessionEntity> = (options, transactionManager) => {
    const repository = this.getRepository(transactionManager);

    return repository.find(options);
  };

  create: Create<SessionEntity> = async (data, transactionManager) => {
    const repository = this.getRepository(transactionManager);
    const token = this.sessionRepository.create(data);

    return repository.save(token);
  };

  update: Update<SessionEntity> = async (where, entity, transactionManager) => {
    const repository = this.getRepository(transactionManager);

    const { affected = 0 } = await repository.update(where, entity);
    const affectedRows = await this.findAll({ where });

    return [affected, affectedRows];
  };

  upsert: Upsert<SessionEntity> = async (data, upsertOptions, transactionManager) => {
    const repository = this.getRepository(transactionManager);

    const { identifiers } = await repository.upsert(data, upsertOptions);

    return [identifiers.length, await repository.find({ where: identifiers })];
  };

  destroy: Destroy<SessionEntity> = async (where, transactionManager) => {
    const repository: Repository<SessionEntity> = this.getRepository(transactionManager);
    const { affected } = await repository.delete(where);

    return affected ?? 0;
  };

  deleteExpired = async (): Promise<void> => {
    const now = new Date();

    await this.sessionRepository.delete({ expiresAt: LessThan(now) });
  };
}
