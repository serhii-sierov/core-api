/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { EntityPropertyNotFoundError, SelectQueryBuilder } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { Alias } from 'typeorm/query-builder/Alias';

/**
 * Patches `QueryBuilder.findColumnsForPropertyPath` to resolve an issue in TypeORM
 * that occurs when nested entities share field names.
 * Source copied and modified from TypeORM v0.3.20.
 * @see https://github.com/typeorm/typeorm/issues/10876
 */
export const patchQueryBuilder = (): void => {
  (SelectQueryBuilder.prototype as any).findColumnsForPropertyPath = function (
    propertyPath: string,
  ): [Alias, string[], ColumnMetadata[]] {
    const self = this as SelectQueryBuilder<any>;

    // Make a helper to iterate the entity & relations?
    // Use that to set the correct alias?  Or the other way around?

    // Start with the main alias with our property paths
    let alias = self.expressionMap.mainAlias;
    const root: string[] = [];
    const propertyPathParts = propertyPath.split('.');

    while (propertyPathParts.length > 1) {
      const part = propertyPathParts[0];

      if (!alias?.hasMetadata) {
        // If there's no metadata, we're wasting our time
        // and can't actually look any of this up.
        break;
      }

      if (alias.metadata.hasEmbeddedWithPropertyPath(part)) {
        // If this is an embedded then we should combine the two as part of our lookup.
        // Instead of just breaking, we keep going with this in case there's an embedded/relation
        // inside an embedded.
        propertyPathParts.unshift(`${propertyPathParts.shift()}.${propertyPathParts.shift()}`);
        continue;
      }

      if (alias.metadata.hasRelationWithPropertyPath(part)) {
        // If this is a relation then we should find the aliases
        // that match the relation & then continue further down
        // the property path

        // >>>>> MARK: PATCH START
        // OLD CODE:
        // const joinAttr = self.expressionMap.joinAttributes.find(joinAttr => joinAttr.relationPropertyPath === part);
        // PATCHED CODE:
        const joinAttr = self.expressionMap.joinAttributes.find(
          attr => attr.entityOrProperty === `${alias?.name}.${part}`,
        );
        // <<<<< MARK: PATCH END

        if (!joinAttr?.alias) {
          const fullRelationPath = root.length > 0 ? `${root.join('.')}.${part}` : part;

          throw new Error(`Cannot find alias for relation at ${fullRelationPath}`);
        }

        alias = joinAttr.alias;
        root.push(...part.split('.'));
        propertyPathParts.shift();
        continue;
      }

      break;
    }

    if (!alias) {
      throw new Error(`Cannot find alias for property ${propertyPath}`);
    }

    // Remaining parts are combined back and used to find the actual property path
    const aliasPropertyPath = propertyPathParts.join('.');

    const columns = alias.metadata.findColumnsWithPropertyPath(aliasPropertyPath);

    if (!columns.length) {
      throw new EntityPropertyNotFoundError(propertyPath, alias.metadata);
    }

    return [alias, root, columns];
  };
};
