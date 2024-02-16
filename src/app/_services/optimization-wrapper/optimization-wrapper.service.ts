import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

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
  OptimizationServiceControllerService,
  RouteElementDetail,
  Route,
  OptimizationHealthControllerService,
  Status,
} from '@openapibuild/openapi';

import { LoadExampleDataService } from '../load-example-data/load-example-data.service';

/**
 * Service to collect settings, run the actual optimization and provide results/data
 * to other components.
 *
 * @export
 * @class OptimizationWrapperService
 */
@Injectable({
  providedIn: 'root',
})
export class OptimizationWrapperService {
  private $refresh: ReplaySubject<any>;

  private myOptimizationInput: RestOptimization;
  private curNodes: Node[];
  private curRess: Resource[];
  private curSettings: OptimizationOptions;

  private $myInternalOptimizationOutput: Observable<RestOptimization>;
  private $myOptimizationOutputSubject: Subject<RestOptimization>;
  private curOptimizationOutput?: RestOptimization;

  // Static methods
  public static nodeResult(
    nodeId: string,
    out: RestOptimization
  ): RouteElementDetail {
    const detailsAspirants = out.solution.routes
      .map((r) => this.getDetailInRoute(nodeId, r))
      .filter((d) => d !== undefined);

    if (detailsAspirants.length !== 0) {
      return detailsAspirants[0];
    }
    return undefined;
  }

  /**
   *
   *
   * @static
   * @param {number} routeId
   * @param {RestOptimization} out
   * @return {*}  {Route}
   * @memberof OptimizationWrapperService
   */
  public static routeResult(
    routeId: number,
    out: RestOptimization
  ): Route {
    const routes = out.solution.routes.filter((r) => r.id === routeId);

    if (routes.length !== 0) {
      return routes[0];
    }
    return undefined;
  }

  /**
   *
   *
   * @private
   * @static
   * @param {string} elementId
   * @param {Route} route
   * @return {*}  {RouteElementDetail}
   * @memberof OptimizationWrapperService
   */
  private static getDetailInRoute(
    elementId: string,
    route: Route
  ): RouteElementDetail {
    return route.elementDetails.find((d) => d.elementId === elementId);
  }

  //

  /**
   * Creates an instance of OptimizationWrapperService.
   * @param {OptimizationServiceControllerService} optiService
   * @param {OptimizationHealthControllerService} healthService
   * @param {LoadExampleDataService} exampleLoaderService
   * @memberof OptimizationWrapperService
   */
  constructor(
    private readonly optiService: OptimizationServiceControllerService,
    private readonly healthService: OptimizationHealthControllerService,
    private exampleLoaderService: LoadExampleDataService
  ) {
    this.$refresh = new ReplaySubject(1);
    this.$myOptimizationOutputSubject = new Subject();
    this.init();
  }

  /**
   *
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
   *
   *
   * @return {*}  {Observable<boolean>}
   * @memberof OptimizationWrapperService
   */
  public getRefreshObservable(): Observable<boolean> {
    return this.$refresh;
  }

  // Getter

  /**
   *
   *
   * @return {*}  {OptimizationOptions}
   * @memberof OptimizationWrapperService
   */
  public optimizerSettings(): OptimizationOptions {
    return this.curSettings;
  }

  /**
   *
   *
   * @param {Resource} curRes
   * @return {*}  {number}
   * @memberof OptimizationWrapperService
   */
  public maxWorkingTimeHoursByResource(curRes: Resource): number {
    if (curRes !== undefined) {
      return moment.duration(curRes.maxTime).asHours();
    }

    return -1;
  }

  /**
   *
   *
   * @param {Node} curNode
   * @return {*}  {number}
   * @memberof OptimizationWrapperService
   */
  public durationMinutesByNode(curNode: Node): number {
    if (curNode !== undefined) {
      return moment.duration(curNode.visitDuration).asMinutes();
    }

    return -1;
  }

  /**
   *
   *
   * @param {string} nodeId
   * @return {*}  {number}
   * @memberof OptimizationWrapperService
   */
  public durationMinutesById(nodeId: string): number {
    const curNode = this.node(nodeId);

    return this.durationMinutesByNode(curNode);
  }

  /**
   *
   *
   * @return {*}  {string[]}
   * @memberof OptimizationWrapperService
   */
  public getAllResourceIds(): string[] {
    return this.resources().map((r) => r.id);
  }

  /**
   *
   *
   * @return {*}  {string[]}
   * @memberof OptimizationWrapperService
   */
  public getAllNodeIds(): string[] {
    return this.nodes().map((n) => n.id);
  }

  /**
   *
   *
   * @return {*}  {string[]}
   * @memberof OptimizationWrapperService
   */
  public getAllElementIds(): string[] {
    const nodeIds = this.getAllNodeIds();
    const resIds = this.getAllResourceIds();

    nodeIds.concat(resIds);

    return nodeIds;
  }

  /**
   *
   *
   * @return {*}  {Node[]}
   * @memberof OptimizationWrapperService
   */
  public nodes(): Node[] {
    return this.curNodes;
  }

  /**
   *
   *
   * @return {*}  {Resource[]}
   * @memberof OptimizationWrapperService
   */
  public resources(): Resource[] {
    return this.curRess;
  }

  /**
   *
   *
   * @param {string} nodeId
   * @return {*}  {Node}
   * @memberof OptimizationWrapperService
   */
  public node(nodeId: string): Node {
    return this.nodes().find((n) => n.id === nodeId);
  }

  /**
   *
   *
   * @param {string} resId
   * @return {*}  {Resource}
   * @memberof OptimizationWrapperService
   */
  public resource(resId: string): Resource {
    return this.resources().find((r) => r.id === resId);
  }

  /**
   *
   *
   * @return {*}  {Observable<RestOptimization>}
   * @memberof OptimizationWrapperService
   */
  public optimizationOutputObservable(): Observable<RestOptimization> {
    return this.$myOptimizationOutputSubject;
  }

  /**
   *
   *
   * @return {*}  {RestOptimization}
   * @memberof OptimizationWrapperService
   */
  public optimizationOutput(): RestOptimization {
    return this.curOptimizationOutput;
  }

  // Setters

  /**
   *
   *
   * @param {string} nodeId
   * @param {number} minutes
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
   *
   *
   * @param {string} resId
   * @param {number} hours
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
   *
   *
   * @param {string} nodeId
   * @param {OpeningHours[]} newHours
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
   *
   *
   * @param {string} nodeId
   * @param {number} latitude
   * @param {number} longitude
   * @memberof OptimizationWrapperService
   */
  public setNodePosition(
    nodeId: string,
    latitude: number,
    longitude: number
  ): void {
    const curNode = this.node(nodeId);

    if (curNode !== undefined) {
      (curNode.type as GeoNode).position.latitude = latitude;
      (curNode.type as GeoNode).position.longitude = longitude;
    }
  }

   /**
   *
   *
   * @param {string} resId
   * @param {number} latitude
   * @param {number} longitude
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
   *
   *
   * @param {string} resId
   * @param {WorkingHours[]} newHours
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
   *
   *
   * @param {OptimizationOptions} newSettings
   * @memberof OptimizationWrapperService
   */
  public setOptimizerSettings(newSettings: OptimizationOptions): void {
    if (newSettings !== undefined) {
      this.myOptimizationInput.optimizationOptions = newSettings;
    }
  }
  /**
   *
   *
   * @return {*}  {Observable<Status>}
   * @memberof OptimizationWrapperService
   */
  public getEndPointStatus(): Observable<Status> {
    return this.healthService.healthStatus();
  }

  // Start optimization

  /**
   *
   *
   * @param {Status} healthStatus
   * @return {*}  {Observable<RestOptimization>}
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

    this.$myInternalOptimizationOutput = this.optiService.run(
      this.myOptimizationInput
    );

    this.$myInternalOptimizationOutput.subscribe({
      next: (watcherEvent: RestOptimization) => {
        this.$myOptimizationOutputSubject.next(watcherEvent);
        this.curOptimizationOutput = watcherEvent;
        //console.log('Watcherevent');
      },
      error: (error) => {
        this.$myOptimizationOutputSubject.error(error);
      },
      complete: () => {
        //console.log('Completed');
      }
    });
    

    return this.$myOptimizationOutputSubject;
  }

  /**
   *
   *
   * @return {*}  {Observable<boolean>}
   * @memberof OptimizationWrapperService
   */
  public stopOptimization(): Observable<boolean> {
    return this.optiService.stopOptimizationRun();
  }
}
