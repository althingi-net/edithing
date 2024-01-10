/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type User = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    role?: User.role;
    createdAt?: string;
    updatedAt?: string;
};

export namespace User {

    export enum role {
        ADMIN = 'admin',
        EDITOR = 'editor',
    }


}

