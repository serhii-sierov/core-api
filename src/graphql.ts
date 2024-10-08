
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface DefaultResponseInterface {
    status: string;
    message?: Nullable<string>;
}

export interface IQuery {
    _empty(): Nullable<string> | Promise<Nullable<string>>;
}

export interface IMutation {
    _empty(): Nullable<string> | Promise<Nullable<string>>;
}

export interface ISubscription {
    _empty(): Nullable<string> | Promise<Nullable<string>>;
}

export interface DefaultResponse extends DefaultResponseInterface {
    status: string;
    message?: Nullable<string>;
}

export type JSON = any;
export type DateTime = any;
export type Upload = any;
type Nullable<T> = T | null;
