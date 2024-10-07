export type Leaves<T, Depth extends number = 10, D extends unknown[] = []> = D['length'] extends Depth
  ? ''
  : T extends object
    ? {
        [K in keyof T]: K extends string | number
          ? `${K}${Leaves<T[K], Depth, [unknown, ...D]> extends '' ? '' : `.${Leaves<T[K], Depth, [unknown, ...D]>}`}`
          : never;
      }[keyof T]
    : '';

export type LeafTypes<T, S extends string | keyof T> = S extends `${infer T1}.${infer T2}`
  ? T1 extends keyof T
    ? LeafTypes<T[T1], T2>
    : never
  : S extends keyof T
    ? T[S]
    : never;
