/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OpenApiService {

    /**
     * Get yaml spec
     * @returns any Successful response
     * @throws ApiError
     */
    public static openApiControllerGetYamlSpec(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/spec.yaml',
        });
    }

    /**
     * Get json spec
     * @returns any Successful response
     * @throws ApiError
     */
    public static openApiControllerGetJsonSpec(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/spec.json',
        });
    }

}
