import { Inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { Subject } from 'rxjs';

import * as moment from 'moment';

import { environment } from './../../../environments/environment';

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
    Configuration
} from 'build/openapi';

import { LoadExampleDataService } from '../load-example-data/load-example-data.service';
import { GeoAndRoutingService } from '../geo-and-routing/geo-and-routing.service';

@Injectable({
    providedIn: 'root'
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
    public static nodeResult(nodeId: string, out: JOptOptimizationOutput): JOptRouteElementDetail {
        const detailsAspirants = out.solution.routes.map(r => this.getDetailInRoute(nodeId, r)).filter(d => d !== undefined);

        console.log(detailsAspirants);

        if (detailsAspirants.length !== 0) {
            return detailsAspirants[0];
        }
        return undefined;

    }

    public static routeResult(routeId: number, out: JOptOptimizationOutput): JOptRoute {
        const routes = out.solution.routes.filter(r => r.id === routeId);


        if (routes.length !== 0) {
            return routes[0];
        }
        return undefined;

    }

    private static getDetailInRoute(elementId: string, route: JOptRoute): JOptRouteElementDetail {
        return route.elementDetails.find(d => d.id === elementId);
    }

    //

    constructor(
        private readonly optiService: OptimizationServiceControllerService,
        private exampleLoaderService: LoadExampleDataService
    ) {
        console.log('OptimizationWrapperService constructor called');
        this.$refresh = new ReplaySubject(1);
        this.$myOptimizationOutputSubject = new Subject();
        this.init();

    }

    public init(): void {



        console.log('OptimizationWrapperService init called');
        this.myOptimizationInput = this.exampleLoaderService.optimizationInput();

        this.curNodes = this.myOptimizationInput.geoNodes;
        this.curRess = this.myOptimizationInput.geoResources;
        this.curSettings = this.myOptimizationInput.runSettings;

        this.$refresh.next(true);

    }

    public getRefreshObservable(): Observable<boolean> {

        return this.$refresh;
    }


    // Getter
    public optimizerSettings(): JOptOptimizationRunOptions {
        return this.curSettings;
    }

    public maxWorkingTimeHoursByResource(curRes: JOptGeoResource): number {

        if (curRes !== undefined) {
            return moment.duration(curRes.maxTime).asHours();
        }

        return -1;
    }

    public durationMinutesByNode(curNode: JOptGeoNode): number {

        console.log(curNode.visitDuration);
        if (curNode !== undefined) {
            return moment.duration(curNode.visitDuration).asMinutes();
        }

        return -1;
    }

    public durationMinutesById(nodeId: string): number {
        const curNode = this.node(nodeId);

        return this.durationMinutesByNode(curNode);
    }

    public getAllResourceIds(): string[] {
        return this.resources().map(r => r.id);
    }

    public getAllNodeIds(): string[] {
        return this.nodes().map(n => n.id);
    }

    public getAllElementIds(): string[] {
        const nodeIds = this.getAllNodeIds();
        const resIds = this.getAllResourceIds();

        nodeIds.concat(resIds);

        return nodeIds;
    }

    public nodes(): JOptGeoNode[] {
        return this.curNodes;
    }

    public resources(): JOptGeoResource[] {
        return this.curRess;
    }

    public node(nodeId: string): JOptGeoNode {
        return this.nodes().find(n => n.id === nodeId);
    }

    public resource(resId: string): JOptGeoResource {
        return this.resources().find(r => r.id === resId);
    }

    public optimizationOutputObservable(): Observable<JOptOptimizationOutput> {

        return this.$myOptimizationOutputSubject;
    }

    public optimizationOutput(): JOptOptimizationOutput {

        return this.curOptimizationOutput;
    }


    // Setters
    public setVisitDurationMinutes(nodeId: string, minutes: number): void {
        const curNode = this.node(nodeId);

        if (curNode !== undefined) {
            curNode.visitDuration = <JOptGeoNodeVisitDuration>moment.duration(minutes, 'minutes').toISOString();
        }
    }

    public setMaxWokringTimeHours(resId: string, hours: number): void {
        const curRes = this.resource(resId);

        if (curRes !== undefined) {
            curRes.maxTime = <JOptGeoResourceMaxTime>moment.duration(hours, 'hours').toISOString();
        }
    }

    public setNodeOpeningHour(nodeId: string, newHours: JOptOpeningHours[]): void {
        const curNode = this.node(nodeId);

        if (curNode !== undefined) {
            curNode.openingHours = newHours;
        }

    }

    public setResourceWorkingHour(resId: string, newHours: JOptWorkingHours[]): void {
        const curRes = this.curRess.find(r => r.id === resId);

        if (curRes !== undefined) {
            curRes.workingHours = newHours;
        }

    }

    public setOptimizerSettings(newSettings: JOptOptimizationRunOptions): void {
        if (newSettings !== undefined) {
            this.myOptimizationInput.runSettings = newSettings;
        }
    }

    //private isHealthyEndpoint(): boolean{
    //  this.optiService.
    //}

    // start optimization
    public startOptimization(): Observable<JOptOptimizationOutput> {

        const connections = this.exampleLoaderService.extractEdgeConnections(this.getAllElementIds());

        this.myOptimizationInput.connections = connections;

        //console.log(this.myOptimizationInput);

        this.$myInternalOptimizationOutput = this.optiService.startOptimizationRun(this.myOptimizationInput);

        this.$myInternalOptimizationOutput.subscribe((watcherEvent: JOptOptimizationOutput) => {

            console.log('watcherEvent', watcherEvent);
            this.$myOptimizationOutputSubject.next(watcherEvent);
            this.curOptimizationOutput = watcherEvent;

        },
            (error) => {
                console.log('error', error);
                this.$myOptimizationOutputSubject.error(error);

            },
            () => {
                console.log('Completed');
            });

        return this.$myOptimizationOutputSubject;
    }

    public stopOptimization(): Observable<boolean> {
        return this.optiService.stopOptimizationRun();
    }
}
