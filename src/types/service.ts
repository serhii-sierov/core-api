import { DeepPartial, EntityManager, FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';

export type UpdateResult<Entity> = [affectedCount: number, affectedRows?: Entity[]];

export type GetIdsByExcludedOptions<Entity> = {
  ids: number[];
  isExclude?: boolean;
  additionalWhere?: FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity>;
};

export type FindOne<Entity> = (
  options: FindOneOptions<Entity>,
  transactionManager?: EntityManager,
) => Promise<Entity | null>;

export type FindOneOrFail<Entity> = (
  options: FindOneOptions<Entity>,
  transactionManager?: EntityManager,
) => Promise<Entity>;

export type FindAll<Entity> = (
  options?: FindManyOptions<Entity>,
  transactionManager?: EntityManager,
) => Promise<Entity[]>;

export type Exists<Entity> = (
  options?: FindManyOptions<Entity>,
  transactionManager?: EntityManager,
) => Promise<boolean>;

export type Count<Entity> = (options?: FindManyOptions<Entity>, transactionManager?: EntityManager) => Promise<number>;

export type Create<Entity> = (data: DeepPartial<Entity>, transactionManager?: EntityManager) => Promise<Entity>;

export type Update<Entity> = (
  where: FindOptionsWhere<Entity>,
  partialEntity: QueryDeepPartialEntity<Entity>,
  transactionManager?: EntityManager,
) => Promise<UpdateResult<Entity>>;

export type Upsert<Entity> = (
  partialEntity: QueryDeepPartialEntity<Entity>,
  upsertOptions: UpsertOptions<Entity>,
  transactionManager?: EntityManager,
) => Promise<UpdateResult<Entity>>;

export type Destroy<Entity> = (where: FindOptionsWhere<Entity>, transactionManager?: EntityManager) => Promise<number>;

type IncrementOptions<Entity> = {
  conditions: FindOptionsWhere<Entity>;
  propertyPath: keyof Entity;
  value: string | number;
};

export type Increment<Entity> = (
  options: IncrementOptions<Entity>,
  transactionManager?: EntityManager,
) => Promise<UpdateResult<Entity>>;

export type FindOrCreate<Entity> = (
  options: FindOneOptions<Entity>,
  defaults?: DeepPartial<Entity>,
) => Promise<[Entity, boolean]>;

export type Optional<Target, Key extends keyof Target> = Omit<Target, Key> & Partial<Target>;

export type Modify<Target, Modifier> = Omit<Target, keyof Modifier> & Modifier;
