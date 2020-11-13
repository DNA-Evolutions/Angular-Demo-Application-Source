import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

import * as moment from 'moment';

import {
  JOptOptimizationInput,
  JOptOptimizationOutput,
  JOptGeoNode,
  JOptGeoResource,
  JOptOptimizationRunOptions,
  JOptOptimizationStartUpSettings,
  JOptOpeningHours,
  JOptWorkingHours,
  OptimizationServiceControllerService,
  JOptRouteElementDetail,
  JOptRoute,
  JOptGeoNodeVisitDuration
} from 'build/openapi';

import { LoadDefaultInputOptimizationDataService } from './load-default-input-optimization-data.service';

@Injectable({
  providedIn: 'root'
})
export class InputOptimizationDataService {

  private myOptimizationInput: JOptOptimizationInput;
  private curNodes: JOptGeoNode[];
  private curRess: JOptGeoResource[];
  private curSettings: JOptOptimizationRunOptions;
  private curKey: JOptOptimizationStartUpSettings;

  private $myInternalOptimizationOutput: Observable<JOptOptimizationOutput>;
  private $myOptimizationOutputSubject: Subject<JOptOptimizationOutput>;
  private curOptimizationOutput?: JOptOptimizationOutput;

  // Static methods
  public static nodeResult(nodeId: string, out: JOptOptimizationOutput): JOptRouteElementDetail {
    const detailsAspirants = out.solution.routes.map(r => this.getDetailInRoute(nodeId, r)).filter(d => d !== undefined);

    //console.log(detailsAspirants);

    if (detailsAspirants.length !== 0) {
      return detailsAspirants[0];
    }
    return undefined;

  }

  private static getDetailInRoute(elementId: string, route: JOptRoute): JOptRouteElementDetail {
    return route.elementDetails.find(d => d.id === elementId);
  }

  //

  constructor(
    private readonly optiService: OptimizationServiceControllerService,
    private loadDefaultInputOptimizationDataService: LoadDefaultInputOptimizationDataService
  ) {
    //console.log('InputOptimizationDataService constructor called');
    this.init();

  }

  init(): void {
    //console.log('Init from  InputOptimizationDataService constructor called');

    this.myOptimizationInput = this.loadDefaultInputOptimizationDataService.input();

    this.curNodes = this.myOptimizationInput.geoNodes;
    this.curRess = this.myOptimizationInput.geoResources;
    this.curSettings = this.myOptimizationInput.runSettings;
    this.curKey = this.myOptimizationInput.keySetting;

    this.$myOptimizationOutputSubject = new Subject();

  }


  // Getter
  public optimizerSettings(): JOptOptimizationRunOptions {
    return this.curSettings;
  }

  public durationMinutesByNode(curNode: JOptGeoNode): number {

    if (curNode !== undefined) {
      return moment.duration(curNode.visitDuration).asMinutes();
    }

    return -1;
  }

  public durationMinutesById(nodeId: string): number {
    const curNode = this.node(nodeId);

    return this.durationMinutesByNode(curNode);
  }

  public nodes(): JOptGeoNode[] {
    return this.curNodes;
  }

  public node(nodeId: string): JOptGeoNode {
    return this.nodes().find(n => n.id === nodeId);
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

  // start optimization
  public startOptimization(): Observable<JOptOptimizationOutput> {
    this.$myInternalOptimizationOutput = this.optiService.startOptimizationRun(this.myOptimizationInput);

    this.$myInternalOptimizationOutput.subscribe((watcherEvent: JOptOptimizationOutput) => {

      //console.log('watcherEvent', watcherEvent);
      this.$myOptimizationOutputSubject.next(watcherEvent);
      this.curOptimizationOutput = watcherEvent;

    },
      (error) => {
        console.log('error', error);

      },
      () => {
        //console.log('Completed');
      });

    return this.$myOptimizationOutputSubject;
  }

  public stopOptimization(): Observable<boolean> {
    return this.optiService.stopOptimizationRun();
  }




  // loadDefaultInputOptimizationDataService.getJSON().subscribe(data => {
  //   this.latestInput = data;
  //   console.log(data);
  //   });





  //myDefaultInput: JOptOptimizationInput;

  //myDefaultInput.

  //myDefaultInput.keySetting;

  //private inputSource = new BehaviorSubject<JOptOptimizationInput>(JSON.parse(myDefaultInput));


  //currentMessage = this.messageSource.asObservable();

  //constructor() { }

  //changeMessage(message: string) {
  //this.messageSource.next(message)
  //}

}
