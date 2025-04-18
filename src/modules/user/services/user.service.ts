import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Create, Destroy, FindAll, FindOne, FindOrCreate, Increment, Update } from 'types';

import { IdentityEntity, UserEntity } from '../entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(IdentityEntity)
    private readonly identityRepository: Repository<IdentityEntity>,
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

  findOrCreate: FindOrCreate<UserEntity> = async (options, defaults, transactionManager) => {
    const repository = this.getRepository(transactionManager);

    const user = await repository.findOne(options);

    if (user) {
      return [user, false];
    }

    const newUser = await this.create(defaults, transactionManager);

    return [newUser, true];
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

  async addIdentity(
    user: UserEntity,
    identityData: Partial<IdentityEntity>,
    transactionManager?: EntityManager,
  ): Promise<IdentityEntity> {
    const repository = transactionManager ? transactionManager.getRepository(IdentityEntity) : this.identityRepository;

    const identity = repository.create({ ...identityData, user: { id: user.id } });

    return repository.save(identity);
  }
}
