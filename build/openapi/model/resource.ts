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
import { WorkingHours } from './workingHours';
import { Qualification } from './qualification';
import { IResourceDepot } from './iResourceDepot';
import { Constraint } from './constraint';
import { Position } from './position';
import { StayOutDefinition } from './stayOutDefinition';
import { ResourceType } from './resourceType';
import { StartReductionTimeDefinition } from './startReductionTimeDefinition';
import { StartReductionTimeIncludeDefinition } from './startReductionTimeIncludeDefinition';
import { StayOutCycleDefinition } from './stayOutCycleDefinition';
import { StartReductionTimePillarDefinition } from './startReductionTimePillarDefinition';


/**
 * A mobile agent (vehicle, driver, technician) available to visit nodes. Defines a home position, one or more working-hour windows with time/distance constraints, optional qualifications (skills), an optional resource depot for pickup-and-delivery, connection efficiency factors, overnight-stay policies, and route configuration (open/closed, alternate destination, return-to-start).
 */
export interface Resource { 
    /**
     * The unique id of the Resource. It is not possible, to create mutliple elements (also Nodes) with the same id.
     */
    id: string;
    /**
     * A custom extra info string that is attached to the Resource.
     */
    extraInfo?: string;
    /**
     * The location id can relate a Resouce to the connection of another resource. See also locationId of Node.
     */
    locationId?: string;
    /**
     * The constraintAliasId. If set is used during constraint assessment instead of using the normal id.
     */
    constraintAliasId?: string;
    type: ResourceType;
    position: Position;
    /**
     * The list of non-overlapping workingHours.
     */
    workingHours: Array<WorkingHours>;
    /**
     * The maxTime. The maximal time a Resource should work within the WorkingHour. This value is NOT logically coupled to the workingHours. For example, a working hour is defined from 8 in the morning till  5 in the afternoon and the maxTime is defined as 4 hours. In this situation an overime violation will be already  generated  when the Resource works from 8 till 1 (one hour of overtime). As JOpt supports flexible start times, the Resource might work from 12-4 (4 hours => not violation). The workingHour itself should be seen as a frame that is used primarily for matching WokingHours of Resources and OpeningHours of nodes. If no flexTime is used, the Resource will always start working at the beginning of its current working hours.
     */
    maxTime: string;
    /**
     * The maxDistance. The maximal distance a Resource is allowed to drive within a certain working hours.
     */
    maxDistance: string;
    destinationPosition?: Position;
    stayOutDefinition?: StayOutDefinition;
    stayOutCycleDefinition?: StayOutCycleDefinition;
    /**
     * The maximum additional working time a resource is allowed to accumulate during an overnight-stay route beyond its normal working-hour boundaries. Acts as a buffer for late arrivals at stay nodes.
     */
    stayOutPolicyTime?: string;
    /**
     * The maximum additional driving distance a resource is allowed to accumulate during an overnight-stay route beyond its normal per-working-hour distance limit. Prevents the resource from driving excessively far to reach a stay node.
     */
    stayOutPolicyDistance?: string;
    /**
     * The multi-dimensional capacity vector of the resource (e.g. weight in kg, volume in m³, number of pallets). Each element represents the maximum capacity for one dimension. Used in pickup-and-delivery (PND) scenarios to enforce load constraints. The index positions must align with the load dimensions defined on the nodes.
     */
    capacity?: Array<number>;
    /**
     * The initial load the resource carries at the start of each route, per capacity dimension. For delivery scenarios, this represents the pre-loaded goods at the depot. For pickup scenarios, this is typically zero. Must have the same dimensionality as the capacity vector.
     */
    initialLoad?: Array<number>;
    /**
     * The minimum degraded capacity per dimension. As the resource visits more stops, its effective capacity may degrade (e.g. due to fatigue, compartment loss, or reorganization overhead). This vector defines the floor below which the capacity cannot degrade, regardless of the number of stops visited.
     */
    minDegratedCapacity?: Array<number>;
    /**
     * The capacity degradation per stop, per dimension. After each node visit, the resource\'s effective capacity is reduced by this amount (down to the minDegratedCapacity floor). Models real-world effects such as compartment unavailability after partial unloading or diminishing usable space.
     */
    capacityDegPerStop?: Array<number>;
    startReductionTimeDefinition?: StartReductionTimeDefinition;
    startReductionTimePillarDefinition?: StartReductionTimePillarDefinition;
    startReductionTimeIncludeDefinition?: StartReductionTimeIncludeDefinition;
    /**
     * The local flexible time. In some cases a Resource should start working later compared to what is defined in the working hours. This way idle time can be reduced. The local flex time is the maximum a Resource is allowed to start working later, depending on the Optimization maybe flex time is not or only partially used.
     */
    flexTime?: string;
    /**
     * The maximum duration by which the resource is allowed to end its working day earlier than the working-hour boundary. Reduces unnecessary idle time at the end of a route. See also postFlexTimeOnlyOnOvertime to restrict usage to overtime-reduction scenarios.
     */
    postFlexTime?: string;
    /**
     * The post flextime is only applied to reduce overtime.
     */
    postFlexTimeOnlyOnOvertime?: boolean | null;
    /**
     * The maximum duration a pillar node may be served after the resource\'s official working-hours end. Applies globally across all working hours of this resource. For per-working-hour overrides, use maxLocalPillarAfterHoursTime on the individual WorkingHours object.
     */
    maxPillarAfterHoursTime?: string;
    /**
     * The maximum driving time allowed from the resource\'s start position to the first node of a route. Prevents the optimizer from assigning a distant first stop that would consume excessive travel time before productive work begins.
     */
    maxDriveTimeFirstNode?: string;
    /**
     * The maximum driving distance allowed from the resource\'s start position to the first node of a route. Complements maxDriveTimeFirstNode to enforce both time- and distance-based proximity constraints.
     */
    maxDriveDistanceFirstNode?: string;
    /**
     * The maximum driving time allowed from the last visited node to the route termination element (typically the resource\'s home position or alternate destination). Prevents the optimizer from placing a final stop that would require an excessively long return journey.
     */
    maxDriveTimeLastNode?: string;
    /**
     * The maximum driving distance allowed from the last visited node to the route termination element. Complements maxDriveTimeLastNode to enforce both time- and distance-based return constraints.
     */
    maxDriveDistanceLastNode?: string;
    /**
     * The kilometerCost defines how much arbitrary cost arises per kilometer driven.
     */
    kilometerCost?: number;
    /**
     * The hourCost defines how much arbitrary cost arises per hour scheduled (idling, working, driving).
     */
    hourCost?: number;
    /**
     * The productionHourCost defines how much arbitrary cost arises per hour working.
     */
    productionHourCost?: number;
    /**
     * The fixCost defines an abstract cost that arrises when this node is visited.
     */
    fixCost?: number;
    /**
     * DEPRECATED. Use startReductionTimeDefinition instead. Legacy field that defined how long before the official working-hour start the resource was allowed to drive.
     */
    preWorkDrivingTime?: string;
    /**
     * DEPRECATED. Use the visitDurationEfficiency mechanism on individual nodes and ResourceVisitDurationEfficiency instead. Legacy factor that scaled visit durations for this resource.
     */
    skillEfficiencyFactor?: number;
    /**
     * The acceptableOvertime. By default if nodes are constantly leading to overtime for a resource, at some point they might get unassigned (if AutoFilter is activated). The acceptable overtime assigns a margin to avoid filtering nodes if they lead to overtime below this margin. By defaul the property  \'JoptAutoFilterWorkingHoursExceedMargin\' can be used to globally define this value.
     */
    acceptableOvertime?: string;
    /**
     * The strictOvertime. By default if nodes are constantly leading to overtime for a resource, at some point they might get unassigned (if AutoFilter is activated). The strictOvertime overtime assigns a margin to avoid filtering nodes if they lead to overtime below this margin. By defaul the property  \'JoptAutoFilterWorkingHoursStrictExceedMargin\' can be used to globally define this value. In contrast to acceptable  overtime, the strict overtime is used during the last fitlering step of the AutoFilter (if strict mode is enabled).
     */
    strictOvertime?: string;
    /**
     * The acceptableOverdistance. Like acceptableOvertime for distance.
     */
    acceptableOverdistance?: string;
    /**
     * The strictOverdistance. Like strictOvertime for distance.
     */
    strictOverdistance?: string;
    /**
     * The averageSpeed of the Resource. By default this value is set to be 22[m/s] (79.2[km/h]). This value is mainly used, in case no external node connections are provided.
     */
    averageSpeed?: number;
    /**
     * The qualifications of the Resource.
     */
    qualifications?: Array<Qualification>;
    /**
     * The constraints  of the Resource
     */
    constraints?: Array<Constraint>;
    /**
     * The connectionTimeEfficiencyFactor. The default time for passing a connection is devided by this factor. For example, if a connections needs 30 minutes to be passed by default, a Resource with a connectionTimeEfficiencyFactor of 1.5 only needs 20 minutes. By default this factor is one.
     */
    connectionTimeEfficiencyFactor?: number;
    /**
     * The co2emissionFactor.
     */
    co2emissionFactor?: number;
    resourceDepot?: IResourceDepot;
    /**
     * The overallVisitDurationEfficiency. The base duration a Resource spends at a node is devided by this factor. For example, if a node has 30 minutes of visit duration assigned, a Resource with a overallVisitDurationEfficiency of 1.5 only needs 20 minutes. By default this factor is one.
     */
    overallVisitDurationEfficiency?: number;
    /**
     * DEPRECATED. Use startReductionTimeDefinition instead. Legacy flag that restricted reduction time to driving only (no working at the first node before the shift starts).
     */
    isReductionTimeOnlyUsedForDriving?: boolean | null;
    /**
     * DEPRECATED. Use StartReductionTimeIncludeDefinition instead. Legacy flag that controlled whether reduction time was counted toward the resource\'s total working time.
     */
    isReductionTimeIncludedInTotalWorkingTime?: boolean | null;
    /**
     * A resource is hub mode gets visited by nodes.
     */
    isServiceHub?: boolean | null;
}

