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
import { RouteHeader } from './routeHeader';
import { Position } from './position';
import { RouteElementDetail } from './routeElementDetail';
import { RouteTrip } from './routeTrip';


/**
 * A single route within the optimization solution. Assigns a resource to a sequence of nodes with full scheduling details. Contains the route header (KPIs), start/end elements and positions, lists of optimizable, non-optimizable, optional, and pillar element ids, per-element scheduling details, and route-level flags.
 */
export interface Route { 
    header?: RouteHeader;
    /**
     * The id is an optimizer provided number identifiying a route.
     */
    id: number;
    /**
     * The resourceId of the Visitor owning this route.
     */
    resourceId: string;
    routeTrip?: RouteTrip;
    /**
     * The startTime of the route. This is usually the start of the workingHours of the Resource. However, when using flextime/reduction-time the starttime can be different from the working hours start.
     */
    startTime: string;
    /**
     * The startElementId, is the element from where the route starts. By default, it is the Resource itself.
     */
    startElementId: string;
    startPosition?: Position;
    /**
     * The endElementId, is the element where the route stops. By default, it is the Resource itself.
     */
    endElementId: string;
    endPosition?: Position;
    /**
     * The optimizableElementIds. The list of optimizable elements that are part of the route.
     */
    optimizableElementIds: Array<string>;
    /**
     * The nonOptimizableElementIds. The list of non-optimizable elements that are part of the route.
     */
    nonOptimizableElementIds: Array<string>;
    /**
     * The optionalOptimizableElementIds. The list of optional elements that are part of the route.
     */
    optionalOptimizableElementIds: Array<string>;
    /**
     * The pillarElementIds. The list of pillar elements that are part of the route.
     */
    pillarElementIds: Array<string>;
    /**
     * The elementDetails. The list of details describing the route schedule.
     */
    elementDetails: Array<RouteElementDetail>;
    /**
     * The pillarLatestEffectiveArrivalOffsetMap. A map of additional time offsets for pillar elements. Each pillar has a latest possible arrival. As a route can consist of multiple pillars, the latest arrival at a certain pillar is also a function of  subsequent pillars. This latest arrival may shifted to a later time spot to allow shifitig a pillar around a normal node, even the normal node would fit before the pillar.
     */
    pillarLatestEffectiveArrivalOffsetMap?: { [key: string]: number; };
    /**
     * The flags. A list of flags indicating statii like which source finalized a route.
     */
    flags?: Array<Route.FlagsEnum>;
    /**
     * The additionalRouteStartOffset
     */
    additionalRouteStartOffset?: number;
    /**
     * The isFinalized. Describes if a route was undergoing finalization.
     */
    isFinalized?: boolean;
    /**
     * The isLockedDown. Describes if a route was undergoing lockdown.
     */
    isLockedDown?: boolean;
    /**
     * The isInactive boolean describes if a route is deactivated.
     */
    isInactive?: boolean;
}
export namespace Route {
    export type FlagsEnum = 'FINALIZED_PILLARFORCEARRANGER' | 'INACTIVE_PILLARFORCEARRANGER' | 'FINALIZED_ROUTE_FINALIZER' | 'INACTIVE_ROUTE_FINALIZER';
    export const FlagsEnum = {
        FinalizedPillarforcearranger: 'FINALIZED_PILLARFORCEARRANGER' as FlagsEnum,
        InactivePillarforcearranger: 'INACTIVE_PILLARFORCEARRANGER' as FlagsEnum,
        FinalizedRouteFinalizer: 'FINALIZED_ROUTE_FINALIZER' as FlagsEnum,
        InactiveRouteFinalizer: 'INACTIVE_ROUTE_FINALIZER' as FlagsEnum
    };
}


