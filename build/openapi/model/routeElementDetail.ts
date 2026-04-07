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
import { Violation } from './violation';
import { Position } from './position';
import { INodeDepot } from './iNodeDepot';


/**
 * The full scheduling record for a single node within a route. Extends the minimal timing data with idle time, transit time and distance to the next element, early/late arrival flags, per-node violations, schedule status, white-space (slack) information, and pickup-and-delivery load exchange details. One RouteElementDetail is produced per visited node in each route of the solution.
 */
export interface RouteElementDetail { 
    /**
     * The elementId that the detail item belongs to.
     */
    elementId: string;
    /**
     * The startTime defines the time when a vistior (Resource) starts serving a node.
     */
    startTime: string;
    /**
     * The arrivalTime defines the time when a vistior (Resource) arrives at a node. It is possible that a Visitior needs to idle at the node until a node opens.
     */
    arrivalTime: string;
    /**
     * The departureTime defines the time a resource is leaving a node.
     */
    departureTime: string;
    /**
     * The transitionTime gives the time taken for the connection from the previous element to this element.
     */
    transitionTime: string;
    effectivePosition?: Position;
    /**
     * The idleTime is the time the Visitor has to wait until a node can be served. By default idle time arrises at the node to be visited. For example, a the arrival time of a Visitor is at 7 in the morning but the node opens at 8. The Visitor has to wait for one hour at the node location until the node can be served.
     */
    idleTime: string;
    /**
     * The zoneId of detail
     */
    zoneId: string;
    /**
     * The whiteSpaceIdleTime only occurs if the Visitor is using a different reduction time definition for normal nodes and PillarNodes. It is usually introduced to avoid a violation where Pillars are allowed to be served before workingTime and Nodes are not.
     */
    whiteSpaceIdleTime?: string;
    /**
     * The durationTime defines how long a node is serverd by a Visitor.
     */
    durationTime: string;
    /**
     * The transitionDistance gives the distance taken for the connection from the previous element to this element.
     */
    transitionDistance: string;
    /**
     * Each visitor can have a list of workingHours. The choosenWorkingHoursIndex is the index of the Visitors workingHour in which the element is visited.
     */
    choosenWorkingHoursIndex?: number;
    /**
     * Each node can have a list of openingHours. The chosenOpeningHoursIndex is the index of the node openingHour in which the node is visited.
     */
    chosenOpeningHoursIndex?: number;
    /**
     * The earlyDeviation. The early deviation describes how long before the element opens the Visitor arrives. If the value is negative, the Vistor arrives after the element already opens.
     */
    earlyDeviation?: string;
    /**
     * The lateDeviation. The late deviation describes how much lateness the Vistor has. For example, the element to be visited is open from 8-11 and the desired visit duration is 2 hours. The Visitor has to arrive latest by 9 to finish the Job until 11. If the Visitor arrives at 10 the late deviation will be one hour, as the Visitor needs till 12 to finish the Job. The late deviation can be also negative indicating not beeing late. For example if the Visitor reaches the element by 8 and finishes the Job by 10 and the element closes at 11 the late deviation will be -1 hour.
     */
    lateDeviation?: string;
    /**
     * The scheduleStatus.
     */
    scheduleStatus?: RouteElementDetail.ScheduleStatusEnum;
    /**
     * The visitorId. The id of the Visitor serving the element.
     */
    visitorId?: string;
    /**
     * LEGACY: The change of the load of the element caused by the Visitor. For example, when the element requested 2 items and the Visitor provided only 1 item the loadChange value would be 1.
     */
    loadChange?: Array<number>;
    /**
     * LEGACY: The curCapacity of the visitor after visiting the element.
     */
    curCapacity?: Array<number>;
    beforeVisitNodeDepot?: INodeDepot;
    afterVisitNodeDepot?: INodeDepot;
    /**
     * The nodeViolations. The violations collected at the element/node. For example, lateViolation, early violation etc.
     */
    nodeViolations?: Array<Violation>;
    /**
     * The isUnlocatedIdleTime changes the representation of the idle time in the solution. By default idle time is located at the node to be waited for. If true, the idle time becomes unlocated. For example, a Visitor can reach a node (that opens at 8) by 7 in the morning. If the idle time is unlocated, the arrival time  will be represented as 8 (instead of 7). 
     */
    isUnlocatedIdleTime?: boolean;
}
export namespace RouteElementDetail {
    export type ScheduleStatusEnum = 'UNKNOWN' | 'EARLY' | 'IDLE' | 'INTIME' | 'LATE';
    export const ScheduleStatusEnum = {
        Unknown: 'UNKNOWN' as ScheduleStatusEnum,
        Early: 'EARLY' as ScheduleStatusEnum,
        Idle: 'IDLE' as ScheduleStatusEnum,
        Intime: 'INTIME' as ScheduleStatusEnum,
        Late: 'LATE' as ScheduleStatusEnum
    };
}


