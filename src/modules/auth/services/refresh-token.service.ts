import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, LessThan, Repository } from 'typeorm';

import { Create, Destroy, Exists, FindAll, FindOne, Update, Upsert } from 'types';

import { RefreshTokenEntity } from '../entities/refresh-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  private getRepository(manager?: EntityManager): Repository<RefreshTokenEntity> {
    return manager ? manager.getRepository(RefreshTokenEntity) : this.refreshTokenRepository;
  }

  exists: Exists<RefreshTokenEntity> = (options, transactionManager) => {
    const repository = this.getRepository(transactionManager);

    return repository.exists(options);
  };

  findOne: FindOne<RefreshTokenEntity> = (options, transactionManager) => {
    const repository = this.getRepository(transactionManager);

    return repository.findOne(options);
  };

  findAll: FindAll<RefreshTokenEntity> = (options, transactionManager) => {
    const repository = this.getRepository(transactionManager);

    return repository.find(options);
  };

  create: Create<RefreshTokenEntity> = async (data, transactionManager) => {
    const repository = this.getRepository(transactionManager);
    const token = this.refreshTokenRepository.create(data);

    return repository.save(token);
  };

  update: Update<RefreshTokenEntity> = async (where, entity, transactionManager) => {
    const repository = this.getRepository(transactionManager);

    const { affected } = await repository.update(where, entity);
    const affectedRows = await this.findAll({ where });

    return [affected, affectedRows];
  };

  upsert: Upsert<RefreshTokenEntity> = async (data, upsertOptions, transactionManager) => {
    const repository = this.getRepository(transactionManager);

    const { identifiers } = await repository.upsert(data, upsertOptions);

    return [identifiers.length, await repository.find({ where: identifiers })];
  };

  destroy: Destroy<RefreshTokenEntity> = async (where, transactionManager) => {
    const repository: Repository<RefreshTokenEntity> = this.getRepository(transactionManager);
    const { affected } = await repository.delete(where);

    return affected;
  };

  insertOrUpdateToken = async (oldToken: string, data: DeepPartial<RefreshTokenEntity>) => {
    const isTokenExists = oldToken && (await this.refreshTokenRepository.exists({ where: { token: oldToken } }));

    if (!isTokenExists) {
      return this.create(data);
    }

    return this.update({ token: oldToken }, data);
  };

  cleanupExpiredTokens = async (): Promise<void> => {
    const now = new Date();

    await this.refreshTokenRepository.delete({ expiresAt: LessThan(now) });
  };
}
