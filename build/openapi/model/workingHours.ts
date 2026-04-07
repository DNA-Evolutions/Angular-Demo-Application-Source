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
import { Qualification } from './qualification';
import { ConstructionHook } from './constructionHook';
import { Constraint } from './constraint';
import { StartReductionTimeDefinition } from './startReductionTimeDefinition';
import { StartReductionTimeIncludeDefinition } from './startReductionTimeIncludeDefinition';
import { StayOutCycleDefinition } from './stayOutCycleDefinition';
import { ReducedNodeEdgeConnectorItem } from './reducedNodeEdgeConnectorItem';
import { StartReductionTimePillarDefinition } from './startReductionTimePillarDefinition';
import { NodeColorCapacity } from './nodeColorCapacity';


/**
 * A time window during which a resource is available for work. Defined by a begin and end instant with a time zone. Supports maximum working time and distance constraints, overtime/overdistance allowances, start-reduction-time (flex-time) policies, stay-out (overnight) definitions, node color capacities, and optional qualifications and depot configurations per working-hour window.
 */
export interface WorkingHours { 
    /**
     * The begin of the Working hours.
     */
    begin: string;
    /**
     * The end of the Working hours.
     */
    end: string;
    /**
     * The zoneId of the Working hours.
     */
    zoneId: string;
    /**
     * The maximal time a Resource should work within the WorkingHour.
     */
    maxTime?: string;
    /**
     * The maximla distance a resource should cover within the WorkingHour.
     */
    maxDistance?: string;
    stayOutCycleDefinition?: StayOutCycleDefinition;
    startReductionTimeDefinition?: StartReductionTimeDefinition;
    startReductionTimePillarDefinition?: StartReductionTimePillarDefinition;
    startReductionTimeIncludeDefinition?: StartReductionTimeIncludeDefinition;
    /**
     * The local flexible time. In some cases a Resource should start working later compared to what is defined in the working hours. This way idle time can be reduced. The local flex time is the maximum a Resource is allowed to start working later, depending on the Optimization maybe flex time is not or only partially used.
     */
    localFlexTime?: string;
    /**
     * The maximum duration by which the resource is allowed to end work earlier than the working-hour boundary. Acts as a flexible end-of-shift buffer — if the last node finishes ahead of schedule, the resource may clock off early by up to this amount, reducing unnecessary idle time at the end of the route. See also localPostFlexTimeOnlyOnOvertime to restrict this behavior to overtime-reduction scenarios only.
     */
    localPostFlexTime?: string;
    /**
     * The post flextime is only applied to reduce overtime.
     */
    localPostFlexTimeOnlyOnOvertime?: boolean | null;
    /**
     * The maximum duration a pillar node is allowed to be served after the official working-hours end for this specific working-hour window. Enables late-shift mandatory stops (e.g. end-of-day depot return) that extend slightly beyond the defined working-hour boundary.
     */
    maxLocalPillarAfterHoursTime?: string;
    /**
     * Per-color capacity limits for routes produced from this working hour. Controls the composition of the route by limiting how many nodes of a given color category may appear (e.g. at most 40% hazardous-goods stops). Overrides any resource-level color capacity when set at the working-hour level.
     */
    nodeColorCapacities?: Array<NodeColorCapacity>;
    /**
     * The constraints for this working hour.
     */
    workingHoursConstraints?: Array<Constraint>;
    /**
     * Constraints that span across multiple working hours of the same resource. Unlike workingHoursConstraints (which apply to a single working-hour window), these constraints enforce policies across the full planning horizon — for example, limiting the total number of a certain node type visited across all days.
     */
    multiWorkingHoursConstraints?: Array<Constraint>;
    /**
     * The hooks for this working hour.
     */
    constructionHooks?: Array<ConstructionHook>;
    /**
     * The qualification of the Resource for this working hour. For example, the Resource is allowed to visit a node needing a skill (defined via a constraint) and the Resource is providing this skill.
     */
    qualifications?: Array<Qualification>;
    /**
     * An optional time offset applied to the route start. Shifts the effective departure time from the resource\'s home location, for example to account for vehicle preparation, warm-up, or loading time before the first stop.
     */
    routeStartTimeHook?: string;
    /**
     * Pre-computed connections used exclusively during the construction hook phase. These connections override the default element connections for hook-related routing decisions, allowing special distance/time calculations during construction (e.g. depot-to-first-stop distances that differ from normal driving).
     */
    hookElementConnections?: Array<ReducedNodeEdgeConnectorItem>;
    /**
     * If true, this resource operates in service-hub mode during this working hour: instead of the resource traveling to visit nodes, nodes are conceptually \'brought to\' the resource\'s location. Useful for modeling stationary service points, reception desks, or warehouse processing stations.
     */
    isLocalServiceHub?: boolean | null;
    /**
     * The isClosedRoute boolean describes if a Resource has to visit the termination element of the Route. By default, the start element and the termination element of a Route is the Resource itself. In case of a closed route, by default, the Resource returns to its original starting location.
     */
    isClosedRoute?: boolean | null;
    /**
     * The boolean isAvailableForStay defines if this working hour is allowed to end at an overnight stay.
     */
    isAvailableForStay?: boolean | null;
}

