/**
 * DNA Evolutions - JOpt.TourOptimizer
 * # JOpt.TourOptimizer REST API  ![DNA Evolutions Logo](https://www.dna-evolutions.com/images/dna_logo.png)  JOpt.TourOptimizer is DNA Evolutions\' route optimization and scheduling engine for transportation, field service, and resource planning scenarios.  This API is a **reactive Spring WebFlux REST service** with an **OpenAPI 3** contract, designed for integration into third-party systems and for generating typed client SDKs directly from the schema.  ---  ## Endpoint groups  ### Job endpoints (`job`)  The primary integration model for all deployments with a connected database.  Submit an optimization job with `POST /api/v1/jobs` and receive an HTTP 202 response containing a unique `jobId`. Use that jobId to poll for status, progress, warnings, errors, and the final result at any time — no open connection required.  | Endpoint | Description | Availability | |---|---|---| | `POST /api/v1/jobs` | Submit an async optimization job | All deployments | | `GET /api/v1/jobs/{jobId}/status` | Poll job status | All deployments | | `GET /api/v1/jobs/{jobId}/result` | Retrieve full optimization result | All deployments | | `GET /api/v1/jobs/{jobId}/solution` | Retrieve solution payload only | All deployments | | `GET /api/v1/jobs/{jobId}/progress` | Retrieve progress snapshots | All deployments | | `GET /api/v1/jobs/{jobId}/warnings` | Retrieve warning messages | All deployments | | `GET /api/v1/jobs/{jobId}/errors` | Retrieve error messages | All deployments | | `GET /api/v1/jobs/{jobId}/export` | Download result as ZIP archive | All deployments | | `POST /api/v1/jobs/{jobId}/stop` | Send graceful stop signal to a running job | All deployments | | `DELETE /api/v1/jobs/{jobId}` | Delete all persisted data for a job | All deployments | | `POST /api/v1/jobs/search` | Search jobs by metadata criteria | On-premise (free-search enabled) | | `POST /api/v1/jobs/import` | Import a pre-computed result directly | On-premise (import enabled) |  All job endpoints require the `X-Tenant-Id` header, injected by the API gateway. The `jobId` returned at submission is the only token needed for all subsequent reads.  ### Synchronous run endpoints (`optimization`)  Available on on-premise installations with synchronous mode enabled. The client holds the HTTP connection open and receives the result directly in the response body.  | Endpoint | Description | |---|---| | `POST /api/v1/runs` | Start a run, return runId immediately (HTTP 202) | | `GET /api/v1/runs/{runId}/result` | Block until run completes, return full result | | `GET /api/v1/runs/{runId}/solution` | Block until run completes, return solution only | | `DELETE /api/v1/runs/{runId}` | Stop the run gracefully | | `GET /api/v1/runs/{runId}/started` | One-shot signal when the run has started |  ### Event stream endpoints (`stream`)  Server-Sent Event streams for monitoring a running synchronous optimization in near real time. Subscribe to one or more streams while a `POST /api/v1/runs` call is in progress.  | Endpoint | Event type | |---|---| | `GET /api/v1/runs/{runId}/stream/progress` | Progress percentage and timing | | `GET /api/v1/runs/{runId}/stream/status` | Lifecycle status transitions | | `GET /api/v1/runs/{runId}/stream/warnings` | Non-fatal solver warnings | | `GET /api/v1/runs/{runId}/stream/errors` | Solver error events |  ### Health endpoint (`health`)  | Endpoint | Description | |---|---| | `GET /api/v1/health` | Service liveness and readiness |  ---  ## Deployment modes and feature flags  Endpoints that require specific conditions are activated via Spring `@Conditional` annotations and application properties. Endpoints not active in a given deployment are absent from the service entirely and do not appear in the runtime spec.  | Condition | Property / annotation | Effect | |---|---|---| | Database connected | `DatabaseEnabledCondition` | Activates all `job` endpoints | | Sync mode | `SynchControllersEnabledCondition` | Activates `optimization` and `stream` endpoints | | Free search | `DatabaseFreeSearchEnabledCondition` | Activates `POST /api/v1/jobs/search` | | Import | `DatabaseJobImportEnabledCondition` | Activates `POST /api/v1/jobs/import` |  ---  ## Tenant isolation  Every job endpoint is scoped by `X-Tenant-Id`, injected by the API gateway. Persisted documents are tagged with both `jobId` and `tenantId`. A request with a valid `jobId` but a mismatched `tenantId` returns no data. The `jobId` is a UUID v4 (122 bits of randomness) and is not a security credential — security is enforced by the verified `tenantId` from the gateway header.  ---  ## Encryption at rest  Results can be stored encrypted in two modes:  - **CLIENT mode**: key derived from a caller-provided passphrase via PBKDF2.   Pass the same secret in `X-Encryption-Secret` when reading back. - **KMS mode**: server-generated data encryption key (DEK) wrapped by an   external key management service (Azure Key Vault, AWS KMS). Decryption is   transparent to the caller.  The `encrypted` and `sec` fields in `DatabaseInfoSearchResult` indicate which mode was used for each stored result.  ---  ## Client generation  The OpenAPI schema can be used to generate typed clients for any language. The `operationId` values follow `{verb}{Resource}` lowerCamelCase convention (`createJob`, `getJobResult`, `listJobs`, etc.) for predictable generated method names.  ---  This service is based on **JOpt Core (unknown)**. 
 *
 * The version of the OpenAPI document: 1.3.5-SNAPSHOT
 * Contact: info@dna-evolutions.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

import { DatabaseInfoSearch } from '../model/models';
import { DatabaseInfoSearchResult } from '../model/models';
import { JOptOptimizationError } from '../model/models';
import { JOptOptimizationProgress } from '../model/models';
import { JOptOptimizationStatus } from '../model/models';
import { JOptOptimizationWarning } from '../model/models';
import { JobAcceptedResponse } from '../model/models';
import { RestOptimization } from '../model/models';
import { Solution } from '../model/models';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class JobService {

    protected basePath = 'http://localhost';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key,
                        (value as Date).toISOString().substr(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * Submit an optimization job.
     * Accepts a RestOptimization payload and starts processing asynchronously. Returns HTTP 202 with a JobAcceptedResponse containing a unique jobId. Use the jobId with X-Tenant-Id to poll the job read endpoints for status, progress, warnings, errors, and the final result. Persistence is scoped to the tenant identified by the X-Tenant-Id header.
     * @param xTenantId Tenant identifier injected by the API gateway. Scopes all persisted data to this tenant.
     * @param restOptimization 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createJob(xTenantId: string, restOptimization: RestOptimization, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<JobAcceptedResponse>;
    public createJob(xTenantId: string, restOptimization: RestOptimization, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<JobAcceptedResponse>>;
    public createJob(xTenantId: string, restOptimization: RestOptimization, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<JobAcceptedResponse>>;
    public createJob(xTenantId: string, restOptimization: RestOptimization, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (xTenantId === null || xTenantId === undefined) {
            throw new Error('Required parameter xTenantId was null or undefined when calling createJob.');
        }
        if (restOptimization === null || restOptimization === undefined) {
            throw new Error('Required parameter restOptimization was null or undefined when calling createJob.');
        }

        let headers = this.defaultHeaders;
        if (xTenantId !== undefined && xTenantId !== null) {
            headers = headers.set('X-Tenant-Id', String(xTenantId));
        }

        let credential: string | undefined;
        // authentication (TenantId) required
        credential = this.configuration.lookupCredential('TenantId');
        if (credential) {
            headers = headers.set('X-Tenant-Id', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<JobAcceptedResponse>(`${this.configuration.basePath}/api/v1/jobs`,
            restOptimization,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Delete all persisted data for a job.
     * Permanently removes the optimization result and all associated stream documents (progress, status, warnings, errors) for the given jobId from the database. Does not stop a running optimization — call POST /api/v1/jobs/{jobId}/stop first and wait for the job to terminate before deleting. Idempotent: returns 200 even if no data exists for this jobId.
     * @param jobId Unique job identifier from the JobAcceptedResponse.
     * @param xTenantId Tenant identifier injected by the API gateway.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteJob(jobId: string, xTenantId: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<boolean>;
    public deleteJob(jobId: string, xTenantId: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<boolean>>;
    public deleteJob(jobId: string, xTenantId: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<boolean>>;
    public deleteJob(jobId: string, xTenantId: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (jobId === null || jobId === undefined) {
            throw new Error('Required parameter jobId was null or undefined when calling deleteJob.');
        }
        if (xTenantId === null || xTenantId === undefined) {
            throw new Error('Required parameter xTenantId was null or undefined when calling deleteJob.');
        }

        let headers = this.defaultHeaders;
        if (xTenantId !== undefined && xTenantId !== null) {
            headers = headers.set('X-Tenant-Id', String(xTenantId));
        }

        let credential: string | undefined;
        // authentication (TenantId) required
        credential = this.configuration.lookupCredential('TenantId');
        if (credential) {
            headers = headers.set('X-Tenant-Id', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.delete<boolean>(`${this.configuration.basePath}/api/v1/jobs/${encodeURIComponent(String(jobId))}`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Download the optimization result as a ZIP archive.
     * Returns a ZIP archive of the persisted optimization result for the given job. If the result was stored with client-side encryption, provide the original passphrase via X-Encryption-Secret and the archive will be decrypted before streaming. For KMS-encrypted or unencrypted results the header can be omitted — decryption is handled transparently by the server. The Content-Disposition header carries the suggested filename.
     * @param jobId Unique job identifier from the JobAcceptedResponse.
     * @param xTenantId Tenant identifier injected by the API gateway.
     * @param xEncryptionSecret Client decryption secret. Required only for CLIENT-mode encrypted results. Omit for KMS or unencrypted.
     * @param timeOut Maximum time to wait for the database response (ISO 8601 duration). Defaults to PT1M.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public exportJob(jobId: string, xTenantId: string, xEncryptionSecret?: string, timeOut?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/octet-stream' | 'application/json'}): Observable<Blob>;
    public exportJob(jobId: string, xTenantId: string, xEncryptionSecret?: string, timeOut?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/octet-stream' | 'application/json'}): Observable<HttpResponse<Blob>>;
    public exportJob(jobId: string, xTenantId: string, xEncryptionSecret?: string, timeOut?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/octet-stream' | 'application/json'}): Observable<HttpEvent<Blob>>;
    public exportJob(jobId: string, xTenantId: string, xEncryptionSecret?: string, timeOut?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/octet-stream' | 'application/json'}): Observable<any> {
        if (jobId === null || jobId === undefined) {
            throw new Error('Required parameter jobId was null or undefined when calling exportJob.');
        }
        if (xTenantId === null || xTenantId === undefined) {
            throw new Error('Required parameter xTenantId was null or undefined when calling exportJob.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (timeOut !== undefined && timeOut !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>timeOut, 'timeOut');
        }

        let headers = this.defaultHeaders;
        if (xTenantId !== undefined && xTenantId !== null) {
            headers = headers.set('X-Tenant-Id', String(xTenantId));
        }
        if (xEncryptionSecret !== undefined && xEncryptionSecret !== null) {
            headers = headers.set('X-Encryption-Secret', String(xEncryptionSecret));
        }

        let credential: string | undefined;
        // authentication (TenantId) required
        credential = this.configuration.lookupCredential('TenantId');
        if (credential) {
            headers = headers.set('X-Tenant-Id', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/octet-stream',
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get(`${this.configuration.basePath}/api/v1/jobs/${encodeURIComponent(String(jobId))}/export`,
            {
                params: queryParameters,
                responseType: "blob",
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Retrieve error messages for a job.
     * Returns persisted error messages for the given job. Errors are only persisted if saveError was enabled in the MongoOptimizationPersistenceSetting.
     * @param jobId Unique job identifier from the JobAcceptedResponse.
     * @param xTenantId Tenant identifier injected by the API gateway.
     * @param limit Maximum number of errors to return.
     * @param sortDirection Sort direction by event time: DESC (newest first) or ASC. Defaults to DESC.
     * @param timeOut Maximum time to wait for the database response (ISO 8601 duration). Defaults to PT1M.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getJobErrors(jobId: string, xTenantId: string, limit?: number, sortDirection?: string, timeOut?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<JOptOptimizationError>>;
    public getJobErrors(jobId: string, xTenantId: string, limit?: number, sortDirection?: string, timeOut?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<JOptOptimizationError>>>;
    public getJobErrors(jobId: string, xTenantId: string, limit?: number, sortDirection?: string, timeOut?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<JOptOptimizationError>>>;
    public getJobErrors(jobId: string, xTenantId: string, limit?: number, sortDirection?: string, timeOut?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (jobId === null || jobId === undefined) {
            throw new Error('Required parameter jobId was null or undefined when calling getJobErrors.');
        }
        if (xTenantId === null || xTenantId === undefined) {
            throw new Error('Required parameter xTenantId was null or undefined when calling getJobErrors.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (limit !== undefined && limit !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>limit, 'limit');
        }
        if (sortDirection !== undefined && sortDirection !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>sortDirection, 'sortDirection');
        }
        if (timeOut !== undefined && timeOut !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>timeOut, 'timeOut');
        }

        let headers = this.defaultHeaders;
        if (xTenantId !== undefined && xTenantId !== null) {
            headers = headers.set('X-Tenant-Id', String(xTenantId));
        }

        let credential: string | undefined;
        // authentication (TenantId) required
        credential = this.configuration.lookupCredential('TenantId');
        if (credential) {
            headers = headers.set('X-Tenant-Id', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<JOptOptimizationError>>(`${this.configuration.basePath}/api/v1/jobs/${encodeURIComponent(String(jobId))}/errors`,
            {
                params: queryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Retrieve progress snapshots for a job.
     * Returns persisted progress snapshots for the given job. Progress events are only persisted if saveProgress was enabled in the MongoOptimizationPersistenceSetting.
     * @param jobId Unique job identifier from the JobAcceptedResponse.
     * @param xTenantId Tenant identifier injected by the API gateway.
     * @param limit Maximum number of snapshots to return.
     * @param sortDirection Sort direction by event time: DESC (newest first) or ASC. Defaults to DESC.
     * @param timeOut Maximum time to wait for the database response (ISO 8601 duration). Defaults to PT1M.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getJobProgress(jobId: string, xTenantId: string, limit?: number, sortDirection?: string, timeOut?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<JOptOptimizationProgress>>;
    public getJobProgress(jobId: string, xTenantId: string, limit?: number, sortDirection?: string, timeOut?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<JOptOptimizationProgress>>>;
    public getJobProgress(jobId: string, xTenantId: string, limit?: number, sortDirection?: string, timeOut?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<JOptOptimizationProgress>>>;
    public getJobProgress(jobId: string, xTenantId: string, limit?: number, sortDirection?: string, timeOut?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (jobId === null || jobId === undefined) {
            throw new Error('Required parameter jobId was null or undefined when calling getJobProgress.');
        }
        if (xTenantId === null || xTenantId === undefined) {
            throw new Error('Required parameter xTenantId was null or undefined when calling getJobProgress.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (limit !== undefined && limit !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>limit, 'limit');
        }
        if (sortDirection !== undefined && sortDirection !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>sortDirection, 'sortDirection');
        }
        if (timeOut !== undefined && timeOut !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>timeOut, 'timeOut');
        }

        let headers = this.defaultHeaders;
        if (xTenantId !== undefined && xTenantId !== null) {
            headers = headers.set('X-Tenant-Id', String(xTenantId));
        }

        let credential: string | undefined;
        // authentication (TenantId) required
        credential = this.configuration.lookupCredential('TenantId');
        if (credential) {
            headers = headers.set('X-Tenant-Id', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<JOptOptimizationProgress>>(`${this.configuration.basePath}/api/v1/jobs/${encodeURIComponent(String(jobId))}/progress`,
            {
                params: queryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Retrieve the full optimization result for a job.
     * Loads the complete persisted optimization snapshot for the given jobId, scoped to the authenticated tenant. If the result was client-encrypted, provide the original secret via X-Encryption-Secret; for KMS-encrypted or unencrypted results the header can be omitted.
     * @param jobId Unique job identifier from the JobAcceptedResponse.
     * @param xTenantId Tenant identifier injected by the API gateway.
     * @param xEncryptionSecret Client decryption secret. Required only for CLIENT-mode encrypted results. Omit for KMS or unencrypted.
     * @param timeOut Maximum time to wait for the database response (ISO 8601 duration). Defaults to PT1M.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getJobResult(jobId: string, xTenantId: string, xEncryptionSecret?: string, timeOut?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<RestOptimization>;
    public getJobResult(jobId: string, xTenantId: string, xEncryptionSecret?: string, timeOut?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<RestOptimization>>;
    public getJobResult(jobId: string, xTenantId: string, xEncryptionSecret?: string, timeOut?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<RestOptimization>>;
    public getJobResult(jobId: string, xTenantId: string, xEncryptionSecret?: string, timeOut?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (jobId === null || jobId === undefined) {
            throw new Error('Required parameter jobId was null or undefined when calling getJobResult.');
        }
        if (xTenantId === null || xTenantId === undefined) {
            throw new Error('Required parameter xTenantId was null or undefined when calling getJobResult.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (timeOut !== undefined && timeOut !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>timeOut, 'timeOut');
        }

        let headers = this.defaultHeaders;
        if (xTenantId !== undefined && xTenantId !== null) {
            headers = headers.set('X-Tenant-Id', String(xTenantId));
        }
        if (xEncryptionSecret !== undefined && xEncryptionSecret !== null) {
            headers = headers.set('X-Encryption-Secret', String(xEncryptionSecret));
        }

        let credential: string | undefined;
        // authentication (TenantId) required
        credential = this.configuration.lookupCredential('TenantId');
        if (credential) {
            headers = headers.set('X-Tenant-Id', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<RestOptimization>(`${this.configuration.basePath}/api/v1/jobs/${encodeURIComponent(String(jobId))}/result`,
            {
                params: queryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Retrieve the solution payload for a job.
     * Returns the Solution portion of the optimization result only, omitting the full optimization input echo. Useful for lightweight integrations that do not need the complete RestOptimization envelope. If the result was client-encrypted, provide X-Encryption-Secret.
     * @param jobId Unique job identifier from the JobAcceptedResponse.
     * @param xTenantId Tenant identifier injected by the API gateway.
     * @param xEncryptionSecret Client decryption secret. Required only for CLIENT-mode encrypted results.
     * @param timeOut Maximum time to wait for the database response (ISO 8601 duration). Defaults to PT1M.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getJobSolution(jobId: string, xTenantId: string, xEncryptionSecret?: string, timeOut?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Solution>;
    public getJobSolution(jobId: string, xTenantId: string, xEncryptionSecret?: string, timeOut?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Solution>>;
    public getJobSolution(jobId: string, xTenantId: string, xEncryptionSecret?: string, timeOut?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Solution>>;
    public getJobSolution(jobId: string, xTenantId: string, xEncryptionSecret?: string, timeOut?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (jobId === null || jobId === undefined) {
            throw new Error('Required parameter jobId was null or undefined when calling getJobSolution.');
        }
        if (xTenantId === null || xTenantId === undefined) {
            throw new Error('Required parameter xTenantId was null or undefined when calling getJobSolution.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (timeOut !== undefined && timeOut !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>timeOut, 'timeOut');
        }

        let headers = this.defaultHeaders;
        if (xTenantId !== undefined && xTenantId !== null) {
            headers = headers.set('X-Tenant-Id', String(xTenantId));
        }
        if (xEncryptionSecret !== undefined && xEncryptionSecret !== null) {
            headers = headers.set('X-Encryption-Secret', String(xEncryptionSecret));
        }

        let credential: string | undefined;
        // authentication (TenantId) required
        credential = this.configuration.lookupCredential('TenantId');
        if (credential) {
            headers = headers.set('X-Tenant-Id', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Solution>(`${this.configuration.basePath}/api/v1/jobs/${encodeURIComponent(String(jobId))}/solution`,
            {
                params: queryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Retrieve status updates for a job.
     * Returns persisted status lifecycle events for the given job (e.g. RUNNING, SUCCESS_WITH_SOLUTION, ERROR). Status events are only persisted if saveStatus was enabled in the MongoOptimizationPersistenceSetting.
     * @param jobId Unique job identifier from the JobAcceptedResponse.
     * @param xTenantId Tenant identifier injected by the API gateway.
     * @param limit Maximum number of events to return.
     * @param sortDirection Sort direction by event time: DESC (newest first) or ASC. Defaults to DESC.
     * @param timeOut Maximum time to wait for the database response (ISO 8601 duration). Defaults to PT1M.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getJobStatus(jobId: string, xTenantId: string, limit?: number, sortDirection?: string, timeOut?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<JOptOptimizationStatus>>;
    public getJobStatus(jobId: string, xTenantId: string, limit?: number, sortDirection?: string, timeOut?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<JOptOptimizationStatus>>>;
    public getJobStatus(jobId: string, xTenantId: string, limit?: number, sortDirection?: string, timeOut?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<JOptOptimizationStatus>>>;
    public getJobStatus(jobId: string, xTenantId: string, limit?: number, sortDirection?: string, timeOut?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (jobId === null || jobId === undefined) {
            throw new Error('Required parameter jobId was null or undefined when calling getJobStatus.');
        }
        if (xTenantId === null || xTenantId === undefined) {
            throw new Error('Required parameter xTenantId was null or undefined when calling getJobStatus.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (limit !== undefined && limit !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>limit, 'limit');
        }
        if (sortDirection !== undefined && sortDirection !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>sortDirection, 'sortDirection');
        }
        if (timeOut !== undefined && timeOut !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>timeOut, 'timeOut');
        }

        let headers = this.defaultHeaders;
        if (xTenantId !== undefined && xTenantId !== null) {
            headers = headers.set('X-Tenant-Id', String(xTenantId));
        }

        let credential: string | undefined;
        // authentication (TenantId) required
        credential = this.configuration.lookupCredential('TenantId');
        if (credential) {
            headers = headers.set('X-Tenant-Id', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<JOptOptimizationStatus>>(`${this.configuration.basePath}/api/v1/jobs/${encodeURIComponent(String(jobId))}/status`,
            {
                params: queryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Retrieve warning messages for a job.
     * Returns persisted warning messages for the given job. Warnings are only persisted if saveWarning was enabled in the MongoOptimizationPersistenceSetting.
     * @param jobId Unique job identifier from the JobAcceptedResponse.
     * @param xTenantId Tenant identifier injected by the API gateway.
     * @param limit Maximum number of warnings to return.
     * @param sortDirection Sort direction by event time: DESC (newest first) or ASC. Defaults to DESC.
     * @param timeOut Maximum time to wait for the database response (ISO 8601 duration). Defaults to PT1M.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getJobWarnings(jobId: string, xTenantId: string, limit?: number, sortDirection?: string, timeOut?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<JOptOptimizationWarning>>;
    public getJobWarnings(jobId: string, xTenantId: string, limit?: number, sortDirection?: string, timeOut?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<JOptOptimizationWarning>>>;
    public getJobWarnings(jobId: string, xTenantId: string, limit?: number, sortDirection?: string, timeOut?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<JOptOptimizationWarning>>>;
    public getJobWarnings(jobId: string, xTenantId: string, limit?: number, sortDirection?: string, timeOut?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (jobId === null || jobId === undefined) {
            throw new Error('Required parameter jobId was null or undefined when calling getJobWarnings.');
        }
        if (xTenantId === null || xTenantId === undefined) {
            throw new Error('Required parameter xTenantId was null or undefined when calling getJobWarnings.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (limit !== undefined && limit !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>limit, 'limit');
        }
        if (sortDirection !== undefined && sortDirection !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>sortDirection, 'sortDirection');
        }
        if (timeOut !== undefined && timeOut !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>timeOut, 'timeOut');
        }

        let headers = this.defaultHeaders;
        if (xTenantId !== undefined && xTenantId !== null) {
            headers = headers.set('X-Tenant-Id', String(xTenantId));
        }

        let credential: string | undefined;
        // authentication (TenantId) required
        credential = this.configuration.lookupCredential('TenantId');
        if (credential) {
            headers = headers.set('X-Tenant-Id', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<JOptOptimizationWarning>>(`${this.configuration.basePath}/api/v1/jobs/${encodeURIComponent(String(jobId))}/warnings`,
            {
                params: queryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Import a pre-computed optimization result into the database.
     * Persists a RestOptimization payload directly without running the optimizer. The call blocks until the write completes. Returns a JobAcceptedResponse containing the generated jobId, which can be used immediately with GET /api/v1/jobs/{jobId}/result to retrieve the imported result. Persistence must be enabled in the RestOptimization extension settings. The tenant is scoped by the X-Tenant-Id header.
     * @param xTenantId Tenant identifier injected by the API gateway. Scopes the persisted result to this tenant.
     * @param restOptimization 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public importJob(xTenantId: string, restOptimization: RestOptimization, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<JobAcceptedResponse>;
    public importJob(xTenantId: string, restOptimization: RestOptimization, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<JobAcceptedResponse>>;
    public importJob(xTenantId: string, restOptimization: RestOptimization, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<JobAcceptedResponse>>;
    public importJob(xTenantId: string, restOptimization: RestOptimization, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (xTenantId === null || xTenantId === undefined) {
            throw new Error('Required parameter xTenantId was null or undefined when calling importJob.');
        }
        if (restOptimization === null || restOptimization === undefined) {
            throw new Error('Required parameter restOptimization was null or undefined when calling importJob.');
        }

        let headers = this.defaultHeaders;
        if (xTenantId !== undefined && xTenantId !== null) {
            headers = headers.set('X-Tenant-Id', String(xTenantId));
        }

        let credential: string | undefined;
        // authentication (TenantId) required
        credential = this.configuration.lookupCredential('TenantId');
        if (credential) {
            headers = headers.set('X-Tenant-Id', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<JobAcceptedResponse>(`${this.configuration.basePath}/api/v1/jobs/import`,
            restOptimization,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Search persisted optimization jobs and return metadata summaries.
     * Accepts a DatabaseInfoSearch body and returns a stream of metadata summaries for all matching optimization jobs. All fields in the search body are optional and combinable. Results are sorted by upload date, newest first by default. Each entry contains a jobId that can be used directly with GET /api/v1/jobs/{jobId}/result to retrieve the full optimization result. Fields absent for encrypted jobs (creator, ident, status, createdTimeStamp) are omitted from each result entry. On-premise only: requires a connected database.
     * @param databaseInfoSearch 
     * @param xTenantId Tenant identifier. When provided, results are scoped to this tenant. In on-premise single-tenant setups this header may be omitted.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public listJobs(databaseInfoSearch: DatabaseInfoSearch, xTenantId?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<DatabaseInfoSearchResult>>;
    public listJobs(databaseInfoSearch: DatabaseInfoSearch, xTenantId?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<DatabaseInfoSearchResult>>>;
    public listJobs(databaseInfoSearch: DatabaseInfoSearch, xTenantId?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<DatabaseInfoSearchResult>>>;
    public listJobs(databaseInfoSearch: DatabaseInfoSearch, xTenantId?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (databaseInfoSearch === null || databaseInfoSearch === undefined) {
            throw new Error('Required parameter databaseInfoSearch was null or undefined when calling listJobs.');
        }

        let headers = this.defaultHeaders;
        if (xTenantId !== undefined && xTenantId !== null) {
            headers = headers.set('X-Tenant-Id', String(xTenantId));
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<Array<DatabaseInfoSearchResult>>(`${this.configuration.basePath}/api/v1/jobs/search`,
            databaseInfoSearch,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Stop a running job gracefully.
     * Sends a graceful stop signal to the running optimization identified by jobId. The optimizer finishes its current iteration and persists the best result found so far. Returns immediately — the stop may take several seconds to complete. Poll GET /api/v1/jobs/{jobId}/status to confirm termination. Returns 200 if the job was found and the signal was sent. Returns 404 if the job is not running (already completed or never started).
     * @param jobId Unique job identifier from the JobAcceptedResponse.
     * @param xTenantId Tenant identifier injected by the API gateway.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public stopJob(jobId: string, xTenantId: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<boolean>;
    public stopJob(jobId: string, xTenantId: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<boolean>>;
    public stopJob(jobId: string, xTenantId: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<boolean>>;
    public stopJob(jobId: string, xTenantId: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (jobId === null || jobId === undefined) {
            throw new Error('Required parameter jobId was null or undefined when calling stopJob.');
        }
        if (xTenantId === null || xTenantId === undefined) {
            throw new Error('Required parameter xTenantId was null or undefined when calling stopJob.');
        }

        let headers = this.defaultHeaders;
        if (xTenantId !== undefined && xTenantId !== null) {
            headers = headers.set('X-Tenant-Id', String(xTenantId));
        }

        let credential: string | undefined;
        // authentication (TenantId) required
        credential = this.configuration.lookupCredential('TenantId');
        if (credential) {
            headers = headers.set('X-Tenant-Id', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<boolean>(`${this.configuration.basePath}/api/v1/jobs/${encodeURIComponent(String(jobId))}/stop`,
            null,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
