
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface SignInInput {
    email: string;
    password: string;
    rememberMe?: Nullable<boolean>;
    device?: Nullable<string>;
}

export interface SignUpInput {
    email: string;
    password: string;
    device?: Nullable<string>;
}

export interface SignOutInput {
    isAllDevices?: Nullable<boolean>;
}

export interface RefreshTokenInput {
    device?: Nullable<string>;
}

export interface ResetPasswordInput {
    email: string;
}

export interface DefaultResponseInterface {
    status: string;
    message?: Nullable<string>;
}

export interface IQuery {
    _empty(): Nullable<string> | Promise<Nullable<string>>;
    user(): Nullable<User> | Promise<Nullable<User>>;
}

export interface IMutation {
    _empty(): Nullable<string> | Promise<Nullable<string>>;
    signUp(input: SignUpInput): Nullable<SignUpResponse> | Promise<Nullable<SignUpResponse>>;
    signIn(input: SignInInput): Nullable<SignInResponse> | Promise<Nullable<SignInResponse>>;
    signOut(input?: Nullable<SignOutInput>): Nullable<boolean> | Promise<Nullable<boolean>>;
    refreshToken(input?: Nullable<RefreshTokenInput>): Nullable<boolean> | Promise<Nullable<boolean>>;
    resetPassword(input: ResetPasswordInput): Nullable<DefaultResponse> | Promise<Nullable<DefaultResponse>>;
}

export interface ISubscription {
    _empty(): Nullable<string> | Promise<Nullable<string>>;
}

export interface DefaultResponse extends DefaultResponseInterface {
    status: string;
    message?: Nullable<string>;
}

export interface SignInResponse {
    user?: Nullable<User>;
}

export interface SignUpResponse {
    user?: Nullable<User>;
}

export interface User {
    id: number;
    email: string;
}

export type JSON = any;
export type DateTime = any;
export type Upload = any;
type Nullable<T> = T | null;
