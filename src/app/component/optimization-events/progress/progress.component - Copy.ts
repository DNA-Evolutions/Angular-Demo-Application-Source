import { Component, OnInit, OnDestroy, NgZone, OnChanges } from '@angular/core';

import { Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

import { JOptOptimizationProgress } from 'build/openapi';
import { EventSourceService } from '../../eventService/event-source.service';

import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';



@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
})
export class ProgressComponent implements OnInit, OnDestroy, OnChanges {

  unsubscribe$: Subject<void> = new Subject<void>();
  latestProgress: JOptOptimizationProgress;
  latestCost: string;

  private $myChartDataObservable: Subject<any>;


  // options for line chart
  animations = false;

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'x';
  showYAxisLabel = true;
  yAxisLabel = 'y';
  autoScale = true;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  single: any[];
  multi: any[];


  count = 0;


  //
  constructor(
    private readonly eventService: EventSourceService,
    private ngZone: NgZone) {

    console.log('OptimizationProgressComponent constructor called');
    this.multi = [
      {
        'name': 'Line',
        'series': []
      }
    ];
    this.$myChartDataObservable = new Subject();
    this.initChart();

  }


  reload(): void {

    this.$myChartDataObservable.subscribe(
      (watcherEvent: any) => {

        this.add2Chart(watcherEvent);
      },
      (error) => console.log('error', error),
      () => {
        console.log('Completed')
      }
    );

    this.eventService.progress().pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (watcherEvent: JOptOptimizationProgress) => {

          this.ngZone.run(() => {
            this.latestProgress = watcherEvent;
            this.latestCost = this.extractCost(watcherEvent.desc);
            this.$myChartDataObservable.next(this.generateNewPoint(this.latestCost));
          });


          //this.add2Chart(this.latestCost);

        },
        (error) => console.log('error', error),
        () => {
          console.log('Completed')
        }
      );


  }

  ngOnChanges(): void {
    console.log('Changes detected')
  }

  generateNewPoint(newCost: string) {
    // const point = {
    //   'name': new Date(new Date().getTime() + (this.count * 60000)),
    //   'value': newCost, 'max': '', 'min': ''
    // };

        const point = {
      'name': this.count,
      'value': newCost, 'max': '', 'min': ''
    };

    return point;
  }

  add2Chart(point: any): void {

    console.log('add 2 chart')

    this.multi[0].series.push(point);
    this.count++;
    this.multi = [...this.multi];
  }


  updateChart(): void {

    console.log('update chart')

    const point = {
      'name': new Date(new Date().getTime() + (this.count * 60000)),
      'value': this.latestCost, 'max': '', 'min': ''
    };

    this.multi[0].series.push(point);
    this.count++;
    this.multi = [...this.multi];
  }

  initChart(): void {

    const val = 1000;

    this.multi[0].series.push({
      'name': this.count,
      'value': val,
      'max': val * 1.5,
      'min': val * 0.5
    });

    this.count++;

  }


  private extractCost(desc: string): string {

    // Eg:
    // PC 98.0, RE 1, AL GeneticEvolution, JC 1060.0160654939095, RC 4, EC 8, TC 12, TT[h] 16, TU[%] 24, TD[km] 978.257,

    // Regexp = (?<=JC.)\d+.\d+
    const regexp: RegExp = /(?<=JC.)\d+.\d+/;

    const matchArray = desc.match(regexp);

    if (matchArray === null || matchArray.length === 0) {
      return '0.0';
    }

    const cost = matchArray[0];

    return cost;
  }


  ngOnInit(): void {

    this.reload();

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }




}
