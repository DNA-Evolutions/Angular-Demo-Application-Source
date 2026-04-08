import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Subject } from 'rxjs';

import * as moment from 'moment';

import {
  RestOptimization,
  Node,
  GeoNode,
  Resource,
  OptimizationOptions,
  OpeningHours,
  WorkingHours,
  OptimizationService,
  RouteElementDetail,
  Route,
  HealthService,
  Status,
  RunAcceptedResponse,
} from '@openapibuild/openapi';

import { LoadExampleDataService } from '../load-example-data/load-example-data.service';

/**
 * Core service responsible for managing the tour optimization lifecycle.
 *
 * This service acts as the central orchestrator for the JOpt Tour Optimizer demo application.
 * It collects optimization input data (nodes, resources, settings), communicates with the
 * JOpt REST API to run optimizations, and distributes results to other components via
 * RxJS observables.
 *
 * Typical usage flow:
 * 1. The service initializes with example data from {@link LoadExampleDataService}.
 * 2. Users can modify nodes, resources, and settings through setter methods.
 * 3. {@link startOptimization} sends the input to the backend and streams results.
 * 4. Other components subscribe to {@link optimizationOutputObservable} for results.
 *
 * @export
 * @class OptimizationWrapperService
 */
@Injectable({
  providedIn: 'root',
})
export class OptimizationWrapperService {
  /** Subject that emits whenever the optimization input data is refreshed or re-initialized. */
  private $refresh: ReplaySubject<any>;

  /** The current optimization input payload that will be sent to the REST API. */
  private myOptimizationInput!: RestOptimization;
  /** Current list of nodes (customer locations / stops) for the optimization. */
  private curNodes!: Node[];
  /** Current list of resources (vehicles / drivers) for the optimization. */
  private curRess!: Resource[];
  /** Current optimizer configuration settings (e.g., algorithm parameters). */
  private curSettings?: OptimizationOptions;

  /** Internal observable for the raw optimization HTTP response. */
  private $myInternalOptimizationOutput!: Observable<RestOptimization>;
  /** Subject used to multicast optimization results to all subscribers. */
  private $myOptimizationOutputSubject!: Subject<RestOptimization>;
  /** Cached copy of the most recent optimization result. */
  private curOptimizationOutput?: RestOptimization;
  /** The unique run identifier returned by the backend for the current optimization run. */
  private currentRunId?: string;
  /** Replay subject that emits the current run ID, replaying the last value to new subscribers. */
  private $runIdSubject = new ReplaySubject<string>(1);

  /**
   * Finds the route element detail for a given node within an optimization result.
   *
   * Searches across all routes in the solution to locate the detail entry that
   * corresponds to the specified node ID.
   *
   * @static
   * @param {string} nodeId - The unique identifier of the node to look up.
   * @param {RestOptimization} out - The optimization result containing solution routes.
   * @returns {RouteElementDetail | undefined} The detail for the node, or undefined if not found.
   * @memberof OptimizationWrapperService
   */
  public static nodeResult(
    nodeId: string,
    out: RestOptimization
  ): RouteElementDetail | undefined {
    const detailsAspirants = (out.solution?.routes ?? [])
      .map((r) => this.getDetailInRoute(nodeId, r))
      .filter((d) => d !== undefined);

    if (detailsAspirants.length !== 0) {
      return detailsAspirants[0];
    }
    return undefined;
  }

  /**
   * Finds a specific route by its numeric ID within an optimization result.
   *
   * @static
   * @param {number} routeId - The numeric identifier of the route to retrieve.
   * @param {RestOptimization} out - The optimization result containing solution routes.
   * @returns {Route | undefined} The matching route, or undefined if no route with that ID exists.
   * @memberof OptimizationWrapperService
   */
  public static routeResult(
    routeId: number,
    out: RestOptimization
  ): Route | undefined {
    const routes = (out.solution?.routes ?? []).filter((r) => r.id === routeId);

    if (routes.length !== 0) {
      return routes[0];
    }
    return undefined;
  }

  /**
   * Searches for a specific element detail within a single route.
   *
   * @private
   * @static
   * @param {string} elementId - The unique identifier of the element (node or resource) to find.
   * @param {Route} route - The route to search within.
   * @returns {RouteElementDetail | undefined} The matching element detail, or undefined if not found.
   * @memberof OptimizationWrapperService
   */
  private static getDetailInRoute(
    elementId: string,
    route: Route
  ): RouteElementDetail | undefined {
    return route.elementDetails.find((d) => d.elementId === elementId);
  }

  //

  /**
   * Creates an instance of OptimizationWrapperService.
   *
   * @param {OptimizationService} optiService - The generated OpenAPI service for communicating with the JOpt REST API.
   * @param {HealthService} healthService - Service for checking the health status of the optimization endpoint.
   * @param {LoadExampleDataService} exampleLoaderService - Service that provides predefined example data for initialization.
   * @memberof OptimizationWrapperService
   */
  constructor(
    private readonly optiService: OptimizationService,
    private readonly healthService: HealthService,
    private exampleLoaderService: LoadExampleDataService
  ) {
    this.$refresh = new ReplaySubject(1);
    this.$myOptimizationOutputSubject = new Subject();
    this.init();
  }

  /**
   * Initializes (or re-initializes) the optimization input from the example data service.
   *
   * Loads the default example data including nodes, resources, and optimizer settings,
   * then signals all subscribers via the refresh observable.
   *
   * @memberof OptimizationWrapperService
   */
  public init(): void {
    this.myOptimizationInput = this.exampleLoaderService.optimizationInput();

    this.curNodes = this.myOptimizationInput.nodes;
    this.curRess = this.myOptimizationInput.resources;
    this.curSettings = this.myOptimizationInput.optimizationOptions;

    this.$refresh.next(true);
  }

  /**
   * Returns an observable that emits whenever the optimization input data is refreshed.
   *
   * Components can subscribe to this to know when to re-render after data changes
   * (e.g., when a new example is loaded).
   *
   * @returns {Observable<boolean>} An observable that emits true on each refresh event.
   * @memberof OptimizationWrapperService
   */
  public getRefreshObservable(): Observable<boolean> {
    return this.$refresh;
  }

  // Getter

  /**
   * Retrieves the current optimizer settings (algorithm parameters, constraints, etc.).
   *
   * @returns {OptimizationOptions | undefined} The current optimization options, or undefined if not set.
   * @memberof OptimizationWrapperService
   */
  public optimizerSettings(): OptimizationOptions | undefined {
    return this.curSettings;
  }

  /**
   * Returns the maximum working time in hours for a given resource.
   *
   * Converts the ISO 8601 duration string stored on the resource into a numeric
   * hour value using moment.js.
   *
   * @param {Resource} curRes - The resource whose maximum working time to retrieve.
   * @returns {number} The maximum working time in hours, or -1 if the resource is undefined.
   * @memberof OptimizationWrapperService
   */
  public maxWorkingTimeHoursByResource(curRes: Resource): number {
    if (curRes !== undefined) {
      return moment.duration(curRes.maxTime).asHours();
    }

    return -1;
  }

  /**
   * Returns the visit duration in minutes for a given node.
   *
   * Converts the ISO 8601 duration string stored on the node into a numeric
   * minute value using moment.js.
   *
   * @param {Node | undefined} curNode - The node whose visit duration to retrieve.
   * @returns {number} The visit duration in minutes, or -1 if the node is undefined.
   * @memberof OptimizationWrapperService
   */
  public durationMinutesByNode(curNode: Node | undefined): number {
    if (curNode !== undefined) {
      return moment.duration(curNode.visitDuration).asMinutes();
    }

    return -1;
  }

  /**
   * Returns the visit duration in minutes for a node identified by its ID.
   *
   * Convenience method that looks up the node by ID and delegates to
   * {@link durationMinutesByNode}.
   *
   * @param {string} nodeId - The unique identifier of the node.
   * @returns {number} The visit duration in minutes, or -1 if the node is not found.
   * @memberof OptimizationWrapperService
   */
  public durationMinutesById(nodeId: string): number {
    const curNode = this.node(nodeId);

    return this.durationMinutesByNode(curNode);
  }

  /**
   * Returns an array of all resource IDs in the current optimization input.
   *
   * @returns {string[]} Array of unique resource identifier strings.
   * @memberof OptimizationWrapperService
   */
  public getAllResourceIds(): string[] {
    return this.resources().map((r) => r.id);
  }

  /**
   * Returns an array of all node IDs in the current optimization input.
   *
   * @returns {string[]} Array of unique node identifier strings.
   * @memberof OptimizationWrapperService
   */
  public getAllNodeIds(): string[] {
    return this.nodes().map((n) => n.id);
  }

  /**
   * Returns an array of IDs for all nodes of type "Event" in the current optimization input.
   *
   * Event nodes are special nodes that do not have a fixed geographic position and are
   * assigned a location by the optimizer.
   *
   * @returns {string[]} Array of event node identifier strings.
   * @memberof OptimizationWrapperService
   */
  public getAllEventNodeIds(): string[] {
    return this.nodes().filter((n) => n.type.typeName === "Event").map((n) => n.id);
  }

  /**
   * Returns an array of all element IDs (nodes and resources combined).
   *
   * Used to build the full set of element connections for the optimization request.
   *
   * @returns {string[]} Array of all element identifier strings.
   * @memberof OptimizationWrapperService
   */
  public getAllElementIds(): string[] {
    const nodeIds = this.getAllNodeIds();
    const resIds = this.getAllResourceIds();

    nodeIds.concat(resIds);

    return nodeIds;
  }

  /**
   * Returns the current list of nodes in the optimization input.
   *
   * Nodes represent customer locations or stops that need to be visited by resources.
   *
   * @returns {Node[]} Array of all current nodes.
   * @memberof OptimizationWrapperService
   */
  public nodes(): Node[] {
    return this.curNodes;
  }

  /**
   * Returns the current list of resources in the optimization input.
   *
   * Resources represent vehicles or drivers that visit the nodes.
   *
   * @returns {Resource[]} Array of all current resources.
   * @memberof OptimizationWrapperService
   */
  public resources(): Resource[] {
    return this.curRess;
  }

  /**
   * Finds and returns a single node by its unique identifier.
   *
   * @param {string} nodeId - The unique identifier of the node to find.
   * @returns {Node | undefined} The matching node, or undefined if not found.
   * @memberof OptimizationWrapperService
   */
  public node(nodeId: string): Node | undefined {
    return this.nodes().find((n) => n.id === nodeId);
  }

  /**
   * Finds and returns a single resource by its unique identifier.
   *
   * @param {string} resId - The unique identifier of the resource to find.
   * @returns {Resource | undefined} The matching resource, or undefined if not found.
   * @memberof OptimizationWrapperService
   */
  public resource(resId: string): Resource | undefined {
    return this.resources().find((r) => r.id === resId);
  }

  /**
   * Returns an observable that emits optimization results as they become available.
   *
   * Components should subscribe to this observable to receive the optimization output
   * after {@link startOptimization} has been called.
   *
   * @returns {Observable<RestOptimization>} An observable stream of optimization results.
   * @memberof OptimizationWrapperService
   */
  public optimizationOutputObservable(): Observable<RestOptimization> {
    return this.$myOptimizationOutputSubject;
  }

  /**
   * Returns the most recent cached optimization result.
   *
   * Unlike {@link optimizationOutputObservable}, this returns the last known result
   * synchronously rather than as a stream.
   *
   * @returns {RestOptimization | undefined} The last optimization result, or undefined if no optimization has completed.
   * @memberof OptimizationWrapperService
   */
  public optimizationOutput(): RestOptimization | undefined {
    return this.curOptimizationOutput;
  }

  // Setters

  /**
   * Sets the visit duration for a node in minutes.
   *
   * The provided minute value is converted to an ISO 8601 duration string
   * and stored on the node.
   *
   * @param {string} nodeId - The unique identifier of the node to update.
   * @param {number} minutes - The new visit duration in minutes.
   * @memberof OptimizationWrapperService
   */
  public setVisitDurationMinutes(nodeId: string, minutes: number): void {
    const curNode = this.node(nodeId);

    if (curNode !== undefined) {
      curNode.visitDuration = (
        moment.duration(minutes, 'minutes').toISOString()
      );
    }
  }

  /**
   * Sets the maximum working time for a resource in hours.
   *
   * The provided hour value is converted to an ISO 8601 duration string
   * and stored on the resource.
   *
   * @param {string} resId - The unique identifier of the resource to update.
   * @param {number} hours - The new maximum working time in hours.
   * @memberof OptimizationWrapperService
   */
  public setMaxWokringTimeHours(resId: string, hours: number): void {
    const curRes = this.resource(resId);

    if (curRes !== undefined) {
      curRes.maxTime = (
        moment.duration(hours, 'hours').toISOString()
      );
    }
  }

  /**
   * Returns the maximum travel distance in kilometers for a given resource.
   *
   * Parses the string-based distance value stored on the resource into a numeric value.
   *
   * @param {Resource} curRes - The resource whose maximum distance to retrieve.
   * @returns {number} The maximum distance in kilometers, or -1 if not set.
   * @memberof OptimizationWrapperService
   */
  public maxDistanceKmByResource(curRes: Resource): number {
    if (curRes?.maxDistance) {
      return parseFloat(curRes.maxDistance);
    }
    return -1;
  }

  /**
   * Sets the maximum travel distance for a resource in kilometers.
   *
   * @param {string} resId - The unique identifier of the resource to update.
   * @param {number} km - The new maximum distance in kilometers.
   * @memberof OptimizationWrapperService
   */
  public setMaxDistanceKm(resId: string, km: number): void {
    const curRes = this.resource(resId);
    if (curRes !== undefined) {
      curRes.maxDistance = km.toFixed(1) + ' km';
    }
  }

  /**
   * Replaces the opening hours for a specific node.
   *
   * Opening hours define when a node (customer) is available to be visited.
   *
   * @param {string} nodeId - The unique identifier of the node to update.
   * @param {OpeningHours[]} newHours - The new set of opening hours to assign.
   * @memberof OptimizationWrapperService
   */
  public setNodeOpeningHour(
    nodeId: string,
    newHours: OpeningHours[]
  ): void {
    const curNode = this.node(nodeId);

    if (curNode !== undefined) {
      curNode.openingHours = newHours;
    }
  }

  /**
   * Updates the geographic position of a node.
   *
   * Only applies to nodes of type "Geo". If the node is not found or is not
   * a GeoNode, no changes are made.
   *
   * @param {string} nodeId - The unique identifier of the node to update.
   * @param {number} latitude - The new latitude coordinate.
   * @param {number} longitude - The new longitude coordinate.
   * @memberof OptimizationWrapperService
   */
  public setNodePosition(
    nodeId: string,
    latitude: number,
    longitude: number
  ): void {
    const curNode = this.node(nodeId);

    if (curNode !== undefined && curNode.type.typeName === 'Geo') {
      (curNode.type as GeoNode).position.latitude = latitude;
      (curNode.type as GeoNode).position.longitude = longitude;
    }
  }

  /**
   * Updates the geographic position of a resource (e.g., the starting depot location).
   *
   * @param {string} resId - The unique identifier of the resource to update.
   * @param {number} latitude - The new latitude coordinate.
   * @param {number} longitude - The new longitude coordinate.
   * @memberof OptimizationWrapperService
   */
  public setResourcePosition(
    resId: string,
    latitude: number,
    longitude: number
  ): void {
    const curRes = this.curRess.find((r) => r.id === resId);

    if (curRes !== undefined) {
      curRes.position.latitude = latitude;
      curRes.position.longitude = longitude;
    }
  }

  /**
   * Replaces the working hours for a specific resource.
   *
   * Working hours define the time windows during which a resource (vehicle/driver)
   * is available to perform visits.
   *
   * @param {string} resId - The unique identifier of the resource to update.
   * @param {WorkingHours[]} newHours - The new set of working hours to assign.
   * @memberof OptimizationWrapperService
   */
  public setResourceWorkingHour(
    resId: string,
    newHours: WorkingHours[]
  ): void {
    const curRes = this.curRess.find((r) => r.id === resId);

    if (curRes !== undefined) {
      curRes.workingHours = newHours;
    }
  }

  /**
   * Replaces the current optimizer settings with new configuration options.
   *
   * @param {OptimizationOptions} newSettings - The new optimization options to apply.
   * @memberof OptimizationWrapperService
   */
  public setOptimizerSettings(newSettings: OptimizationOptions): void {
    if (newSettings !== undefined) {
      this.myOptimizationInput.optimizationOptions = newSettings;
    }
  }
  /**
   * Checks the health status of the JOpt optimization endpoint.
   *
   * Should be called before starting an optimization to verify the backend is available.
   *
   * @returns {Observable<Status>} An observable that emits the current health status.
   * @memberof OptimizationWrapperService
   */
  public getEndPointStatus(): Observable<Status> {
    return this.healthService.getHealth();
  }

  // Start optimization

  /**
   * Starts the tour optimization process by sending the current input to the JOpt REST API.
   *
   * This method first validates that the endpoint is healthy, then assembles the element
   * connections, submits the optimization run via a two-step process (start run, then
   * fetch result), and multicasts the result to all subscribers.
   *
   * The returned observable (and {@link optimizationOutputObservable}) will emit the
   * complete optimization result once the backend finishes processing.
   *
   * @param {Status} healthStatus - The current health status of the endpoint (must be "UP").
   * @returns {Observable<RestOptimization>} An observable that emits the optimization result.
   * @throws {Error} If the endpoint health status is not "UP".
   * @memberof OptimizationWrapperService
   */
  public startOptimization(
    healthStatus: Status
  ): Observable<RestOptimization> {
    // Check health first

    console.log('healthStatus: ' + JSON.stringify(healthStatus));

    if (healthStatus.status !== 'UP') {
      console.log('Error - Endpoint is reachable but not healthy');

      const notHealthyError = new Error(
        'The endpoint reports an non-UP status.'
      );
      notHealthyError.name = 'Endpoint unhealthy';
      notHealthyError.message = 'Endpoint unhealthy';
      throw notHealthyError;
    }

    const connections = this.exampleLoaderService.extractEdgeConnections(
      this.getAllElementIds()
    );

    this.myOptimizationInput.elementConnections = connections;

    this.$myInternalOptimizationOutput = this.optiService.startRun(
      this.myOptimizationInput
    ).pipe(
      switchMap((accepted: RunAcceptedResponse) => {
        this.currentRunId = accepted.runId;
        this.$runIdSubject.next(accepted.runId!);
        return this.optiService.getRunResult(accepted.runId!, 'body');
      })
    );

    this.$myInternalOptimizationOutput.subscribe({
      next: (watcherEvent: RestOptimization) => {
        this.$myOptimizationOutputSubject.next(watcherEvent);
        this.curOptimizationOutput = watcherEvent;
      },
      error: (error) => {
        this.$myOptimizationOutputSubject.error(error);
      },
      complete: () => {
        console.log('Optimization completed');
      }
    });

    return this.$myOptimizationOutputSubject;
  }

  /**
   * Returns the current optimization run ID, if an optimization has been started.
   *
   * @returns {string | undefined} The run ID, or undefined if no optimization is active.
   * @memberof OptimizationWrapperService
   */
  public getRunId(): string | undefined {
    return this.currentRunId;
  }

  /**
   * Returns an observable that emits the run ID when an optimization starts.
   *
   * Uses a ReplaySubject so late subscribers still receive the most recent run ID.
   *
   * @returns {Observable<string>} An observable that emits the optimization run ID.
   * @memberof OptimizationWrapperService
   */
  public getRunId$(): Observable<string> {
    return this.$runIdSubject.asObservable();
  }

  /**
   * Sends a stop request to the backend to cancel the currently running optimization.
   *
   * @returns {Observable<boolean>} An observable that emits true when the stop is acknowledged.
   * @throws {Error} If no active run exists (no run ID is available).
   * @memberof OptimizationWrapperService
   */
  public stopOptimization(): Observable<boolean> {
    if (!this.currentRunId) {
      throw new Error('No active run to stop.');
    }
    return this.optiService.stopRun(this.currentRunId);
  }
}
