import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { Subject } from 'rxjs';

import * as moment from 'moment';

import {
  JOptOptimizationInput,
  JOptOptimizationOutput,
  JOptGeoNode,
  JOptGeoResource,
  JOptOptimizationRunOptions,
  JOptOpeningHours,
  JOptWorkingHours,
  OptimizationServiceControllerService,
  JOptRouteElementDetail,
  JOptRoute,
  JOptGeoNodeVisitDuration,
  JOptGeoResourceMaxTime,
  OptimizationHealthControllerService,
  Status,
} from 'build/openapi';

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

  private myOptimizationInput: JOptOptimizationInput;
  private curNodes: JOptGeoNode[];
  private curRess: JOptGeoResource[];
  private curSettings: JOptOptimizationRunOptions;

  private $myInternalOptimizationOutput: Observable<JOptOptimizationOutput>;
  private $myOptimizationOutputSubject: Subject<JOptOptimizationOutput>;
  private curOptimizationOutput?: JOptOptimizationOutput;

  // Static methods
  public static nodeResult(
    nodeId: string,
    out: JOptOptimizationOutput
  ): JOptRouteElementDetail {
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
   * @param {JOptOptimizationOutput} out
   * @return {*}  {JOptRoute}
   * @memberof OptimizationWrapperService
   */
  public static routeResult(
    routeId: number,
    out: JOptOptimizationOutput
  ): JOptRoute {
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
   * @param {JOptRoute} route
   * @return {*}  {JOptRouteElementDetail}
   * @memberof OptimizationWrapperService
   */
  private static getDetailInRoute(
    elementId: string,
    route: JOptRoute
  ): JOptRouteElementDetail {
    return route.elementDetails.find((d) => d.id === elementId);
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

    this.curNodes = this.myOptimizationInput.geoNodes;
    this.curRess = this.myOptimizationInput.geoResources;
    this.curSettings = this.myOptimizationInput.runSettings;

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
   * @return {*}  {JOptOptimizationRunOptions}
   * @memberof OptimizationWrapperService
   */
  public optimizerSettings(): JOptOptimizationRunOptions {
    return this.curSettings;
  }

  /**
   *
   *
   * @param {JOptGeoResource} curRes
   * @return {*}  {number}
   * @memberof OptimizationWrapperService
   */
  public maxWorkingTimeHoursByResource(curRes: JOptGeoResource): number {
    if (curRes !== undefined) {
      return moment.duration(curRes.maxTime).asHours();
    }

    return -1;
  }

  /**
   *
   *
   * @param {JOptGeoNode} curNode
   * @return {*}  {number}
   * @memberof OptimizationWrapperService
   */
  public durationMinutesByNode(curNode: JOptGeoNode): number {
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
   * @return {*}  {JOptGeoNode[]}
   * @memberof OptimizationWrapperService
   */
  public nodes(): JOptGeoNode[] {
    return this.curNodes;
  }

  /**
   *
   *
   * @return {*}  {JOptGeoResource[]}
   * @memberof OptimizationWrapperService
   */
  public resources(): JOptGeoResource[] {
    return this.curRess;
  }

  /**
   *
   *
   * @param {string} nodeId
   * @return {*}  {JOptGeoNode}
   * @memberof OptimizationWrapperService
   */
  public node(nodeId: string): JOptGeoNode {
    return this.nodes().find((n) => n.id === nodeId);
  }

  /**
   *
   *
   * @param {string} resId
   * @return {*}  {JOptGeoResource}
   * @memberof OptimizationWrapperService
   */
  public resource(resId: string): JOptGeoResource {
    return this.resources().find((r) => r.id === resId);
  }

  /**
   *
   *
   * @return {*}  {Observable<JOptOptimizationOutput>}
   * @memberof OptimizationWrapperService
   */
  public optimizationOutputObservable(): Observable<JOptOptimizationOutput> {
    return this.$myOptimizationOutputSubject;
  }

  /**
   *
   *
   * @return {*}  {JOptOptimizationOutput}
   * @memberof OptimizationWrapperService
   */
  public optimizationOutput(): JOptOptimizationOutput {
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
      curNode.visitDuration = <JOptGeoNodeVisitDuration>(
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
      curRes.maxTime = <JOptGeoResourceMaxTime>(
        moment.duration(hours, 'hours').toISOString()
      );
    }
  }

  /**
   *
   *
   * @param {string} nodeId
   * @param {JOptOpeningHours[]} newHours
   * @memberof OptimizationWrapperService
   */
  public setNodeOpeningHour(
    nodeId: string,
    newHours: JOptOpeningHours[]
  ): void {
    const curNode = this.node(nodeId);

    if (curNode !== undefined) {
      curNode.openingHours = newHours;
    }
  }

  /**
   *
   *
   * @param {string} resId
   * @param {JOptWorkingHours[]} newHours
   * @memberof OptimizationWrapperService
   */
  public setResourceWorkingHour(
    resId: string,
    newHours: JOptWorkingHours[]
  ): void {
    const curRes = this.curRess.find((r) => r.id === resId);

    if (curRes !== undefined) {
      curRes.workingHours = newHours;
    }
  }

  /**
   *
   *
   * @param {JOptOptimizationRunOptions} newSettings
   * @memberof OptimizationWrapperService
   */
  public setOptimizerSettings(newSettings: JOptOptimizationRunOptions): void {
    if (newSettings !== undefined) {
      this.myOptimizationInput.runSettings = newSettings;
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
   * @return {*}  {Observable<JOptOptimizationOutput>}
   * @memberof OptimizationWrapperService
   */
  public startOptimization(
    healthStatus: Status
  ): Observable<JOptOptimizationOutput> {
    // Check health first

    console.log('healthStatus: ' + healthStatus);

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

    this.myOptimizationInput.connections = connections;

    this.$myInternalOptimizationOutput = this.optiService.startOptimizationRun(
      this.myOptimizationInput
    );

    this.$myInternalOptimizationOutput.subscribe(
      (watcherEvent: JOptOptimizationOutput) => {
        this.$myOptimizationOutputSubject.next(watcherEvent);
        this.curOptimizationOutput = watcherEvent;
        console.log('Watcherevent');
      },
      (error) => {
        this.$myOptimizationOutputSubject.error(error);
      },
      () => {
        //console.log('Completed');
      }
    );

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
