import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Create, Destroy, FindAll, FindOne, Increment, Update } from 'types';

import { ProviderEntity, UserEntity } from '../entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(ProviderEntity)
    private readonly providerRepository: Repository<ProviderEntity>,
  ) {}

  private getRepository(manager?: EntityManager): Repository<UserEntity> {
    return manager ? manager.getRepository(UserEntity) : this.userRepository;
  }

  findOne: FindOne<UserEntity> = (options, transactionManager) => {
    const repository = this.getRepository(transactionManager);

    return repository.findOne(options);
  };

  findAll: FindAll<UserEntity> = (options, transactionManager) => {
    const repository = this.getRepository(transactionManager);

    return repository.find(options);
  };

  create: Create<UserEntity> = async (data, transactionManager) => {
    const repository = this.getRepository(transactionManager);
    const user = repository.create(data);

    return repository.save(user);
  };

  increment: Increment<UserEntity> = async (options, transactionManager) => {
    const repository = this.getRepository(transactionManager);

    const { affected = 0 } = await repository.increment(options.conditions, options.propertyPath, options.value);

    const affectedRows = await this.findAll({ where: options.conditions }, transactionManager);

    return [affected, affectedRows];
  };

  update: Update<UserEntity> = async (where, entity, transactionManager) => {
    const repository = this.getRepository(transactionManager);

    const { affected = 0 } = await repository.update(where, entity);
    const affectedRows = await this.findAll({ where }, transactionManager);

    return [affected, affectedRows];
  };

  destroy: Destroy<UserEntity> = async (options, transactionManager) => {
    const repository: Repository<UserEntity> = this.getRepository(transactionManager);
    const { affected } = await repository.delete(options);

    return affected ?? 0;
  };

  async addProvider(user: UserEntity, providerData: Partial<ProviderEntity>): Promise<ProviderEntity> {
    const provider = this.providerRepository.create({ ...providerData, user });

    return this.providerRepository.save(provider);
  }
}
