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
import { LoadDimension } from './loadDimension';
import { Qualification } from './qualification';
import { Constraint } from './constraint';
import { NodeType } from './nodeType';
import { NodeColor } from './nodeColor';
import { INodeDepot } from './iNodeDepot';
import { OfferedNode } from './offeredNode';
import { OpeningHours } from './openingHours';


/**
 * A work item, customer location, or event to be scheduled and assigned to a resource. Each node defines a type (GeoNode, EventNode, or pillar variants), opening-hour windows, a required visit duration, and optional constraints, pickup-and-delivery loads, priority, node color, and relations to other nodes.
 */
export interface Node { 
    /**
     * The unique id of the node. It is not possible, to create mutliple elements (also Resources) with the same id.
     */
    id: string;
    /**
     * A custom extra info string that is attached to the Node.
     */
    extraInfo?: string;
    /**
     * The location id can relate a node to the connection of another node. For example  the node \'MyFirstNode\' and \'MySecondNode\' have the same location. It is sufficient to provide the  connection data for \'MyFirstNode\' and set the LocationId of \'MySecondNode\' to be \'MyFirstNode\'
     */
    locationId?: string;
    /**
     * The constraintAliasId. If set is used during constraint assessment instead of using the normal id.
     */
    constraintAliasId?: string;
    type: NodeType;
    /**
     * The list of non-overlapping openingHours of the nodes.
     */
    openingHours: Array<OpeningHours>;
    /**
     * The visitDuration defines how long a visitor needs to stay at the node.
     */
    visitDuration: string;
    /**
     * The constraints of this node
     */
    constraints?: Array<Constraint>;
    offeredNode?: OfferedNode;
    loadDimension?: LoadDimension;
    /**
     * The multi-dimensional load vector for this node in pickup-and-delivery scenarios. Each element corresponds to a capacity dimension on the resource (e.g. weight, volume, pallet count). Positive values typically represent demand (delivery), while the interpretation depends on the loadDimension configuration.
     */
    load?: Array<number>;
    /**
     * The qualifications of the node.
     */
    qualifications?: Array<Qualification>;
    /**
     * An optional lockdown time (in milliseconds) during which this node cannot be reassigned or moved by the optimizer after initial placement. Useful for protecting confirmed appointments from being rescheduled during re-optimization runs.
     */
    lockdownTime?: number;
    /**
     * The fixCost defines an abstract cost that arrises when this node is visited.
     */
    fixCost?: number;
    /**
     * The priority of the node. A higher priority leads to a higher cost if a node shows violations. As the Optimizer tries to reduce cost, a higher priority results in lower chance  of seeing violations on this node. However, if all nodes of an Optimization have a priority, the effect vanishes.
     */
    priority?: number;
    /**
     * The priorityFirst defines if we want a node to be the first node in a route-solution.
     */
    priorityFirst?: number;
    /**
     * The priorityLast defines if we want a node to be the last node in a route-solution.
     */
    priorityLast?: number;
    nodeColor?: NodeColor;
    /**
     * The minimum number of optimization executions during which this node is protected from being removed by the AutoFilter. After this many executions, the AutoFilter may exclude this node if it consistently causes infeasibility. Set to 0 (default) to allow immediate filtering.
     */
    minAutoFilterProtectedExecutions?: number;
    nodeDepot?: INodeDepot;
    /**
     * If true, the actual visit duration at this node may be adjusted based on the resource\'s visitDurationEfficiency factor. A more efficient resource completes the task faster (down to minVisitDuration). If false, the visitDuration is fixed regardless of which resource visits.
     */
    routeDependentVisitDuration?: boolean | null;
    /**
     * If true, the optimizer is allowed to reposition this node within the route sequence specifically to reduce the resource\'s flex-time usage. Useful when minimizing flex-time consumption is a priority (e.g. contractual constraints on early/late start deviations).
     */
    allowMoveToReduceFlexTime?: boolean | null;
    /**
     * The minimum visit duration floor when routeDependentVisitDuration is enabled. Even if the resource\'s efficiency factor would reduce the visit time further, it cannot go below this threshold. Ensures a realistic minimum service time regardless of resource skill level.
     */
    minVisitDuration?: string;
    /**
     * The jointVisitDuration. If nodes are situated closely to each other (defined via property \'JOpt.JointVisitDuration.maxRadiusMeter\') a joint visit duration can be defined. For example, 3 nodes have a visit duration of 20 minutes each. The  joint visit duration for ALL nodes is set to be 10 minutes. Further, they are close enough to each other, that the joint visit duration logic can be triggered. The optimizer finds a solution in which all three nodes are visted in direct succession. The first node (of the three) needs to be visted for the original visit duration of 20 minutes. The seconds and third nodes only needs to be visited for 10 minutes.
     */
    jointVisitDuration?: string;
    /**
     * The duration the resource must spend at this node before returning to the route start location (return-to-start behavior). Used in scenarios where a resource must revisit its depot mid-route (e.g. to reload supplies) and the node acts as a return-to-start trigger point.
     */
    returnStartDuration?: string;
    /**
     * The boolean isOptimizable. Defines if a node is optimizable. This property will be auto-defined by the optimizer..
     */
    isOptimizable?: boolean | null;
    /**
     * The boolean isOptional. If a node is optional, the Optimizer can decide on its own, if the node is visited or not. Usually, this settings only makes sense in PND problems.
     */
    isOptional?: boolean | null;
    /**
     * The boolean isUnassigned. Defines if a node was unassigned by the Optimizer.
     */
    isUnassigned?: boolean | null;
    /**
     * The boolean isWaitOnEarlyArrival. In case a Resources reaches a node too early (before the start of the node\'s OpeningHours), the Resource can either start working direclty (false) or wait for the node to open (true, default).
     */
    isWaitOnEarlyArrival?: boolean | null;
    /**
     * The boolean isOpeningHoursIncludesDuration. By default a node\'s openingHour defines the time-window  in which a task has to be fulfilled, meaning a Visitor has to arrive, work, and leave within that time-window. If isOpeningHoursIncludesDuration is set to false, the time-window only counts as arrival-window for the Resource.
     */
    isOpeningHoursIncludesDuration?: boolean | null;
    /**
     * The boolean isCausingIdleTimeCost. By default, waiting at a node to open is creating idle time cost. As the Optimizer tries to reduce cost, it will also try to reschedule nodes if idle time cost is generated. In some problem setups (especially problems of the kind: Low node count, high WorkingHours availability) it may be desired to keep the position of the nodes, even though idle time is created.
     */
    isCausingIdleTimeCost?: boolean | null;
    /**
     * False: If a resource in hub mode deals with this node, the earlist openingHours start of the node describes the earlist time the resource can start working on the node. TRUE:  If a resource in hub mode deals with this node, the connection time is added to the earlist openinghour start of the node, effectively acting as offset. This can be used for example, for shipping scnearios where a package takes 3 days.
     */
    isUnlocatedHubConnectionTime?: boolean | null;
    /**
     * The boolean isWaitOnEarlyArrivalFirstNode. In case a Resources reaches the FIRST node of a route too early (before the start of the node\'s OpeningHours),\"              + \" the Resource can either start working direclty (true) or wait for the FIRST node to open (false, default). This setting only takes action if isWaitOnEarlyArrival is set to true.
     */
    isWaitOnEarlyArrivalFirstNode?: boolean | null;
    /**
     * If true, this node is excluded from routing whenever its visit duration is zero. A node with zero visit duration contributes no service time to a route, so visiting it provides no operational value. Enabling this flag allows the optimizer to skip such nodes automatically, reducing route length and travel cost. Defaults to false.
     */
    isIgnoreOnZeroDuration?: boolean | null;
    /**
     * The boolean isStayNode defines if a node is capable to be a stay node. A stay node overrides the route termination element of a route, and the route start element of the next route and is  used in the context of \'overnight-stays\'.
     */
    isStayNode?: boolean | null;
    /**
     * If true, this node is excluded from routing whenever its effective load exchange is zero at the time of evaluation. For supply nodes this means the node is skipped once its available supply has been fully consumed. For request nodes (including coupled split-nodes) this means the node is suppressed when the optimizer has assigned zero demand to it - for example, when a coupled partner already carries the full group total. Setting this flag reduces unnecessary route stops and lowers travel cost without affecting the coupling invariant, since a zero-load node contributes nothing to the delivery. Defaults to false.
     */
    isIgnoreOnZeroLoad?: boolean | null;
    /**
     * DEPRECATED. Defines whether this node represents actual productive work. When false, the node is treated as a non-productive stop (e.g. a waypoint or break location). This field is deprecated and may be removed in a future version.
     */
    isWorkNode?: boolean | null;
}

