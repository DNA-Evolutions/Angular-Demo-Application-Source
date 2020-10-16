import { Component, OnInit, OnDestroy, NgZone, OnChanges } from '@angular/core';

import { Subject, Observable } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

import { JOptOptimizationProgress } from 'build/openapi';
import { EventSourceService } from '../../eventService/event-source.service';

import { BrowserModule } from '@angular/platform-browser';

import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-visual-progress',
  templateUrl: './progress-visual.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisualProgressComponent implements OnInit, OnDestroy {

  unsubscribe$: Subject<void> = new Subject<void>();
  latestCost: string;

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
  view: any[] = [300, 200];


  count = 0;

  constructor(
    private readonly eventService: EventSourceService,
    private cd: ChangeDetectorRef
  ) {

    this.multi = [
      {
        'name': 'Line',
        'series': []
      }
    ];


  }


  ngOnInit(): void {
    this.initChart();

    this.eventService.progress().pipe(takeUntil(this.unsubscribe$)).subscribe((progress: JOptOptimizationProgress) => {
      this.latestCost = this.extractCost(progress.desc);


      if (this.latestCost !== undefined) {
        const addCost = '1000';
        console.log('add 2 chart: ' + addCost);
        this.add2Chart(addCost);
        this.cd.markForCheck();
      }

    });

    // this.eventService.progress().pipe(takeUntil(this.unsubscribe$)).subscribe((progress: JOptOptimizationProgress) => {
    //   this.latestCost = this.extractCost(progress.desc);


    //   if (this.latestCost !== undefined) {
    //     const addCost = '1000';
    //     console.log('add 2 chart: ' + addCost);
    //     this.add2Chart(addCost);
    //     this.cd.markForCheck();
    //   }

    // });


  }


  extractCost(desc: string): string {

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


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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

    this.multi = [...this.multi];

  }


  formatPercent(val) {

    //console.log("fomratPercent:"+val);

    if (val === undefined) {
      val = '0';
    }


    if (val <= 10000) {
      return val + '%';
    }

    return val;
  }

  onSelect(event) {
    console.log(event);
  }

  generateNewPoint(newCost: string) {
    // const point = {
    //   'name': new Date(new Date().getTime() + (this.count * 60000)),
    //   'value': newCost, 'max': '', 'min': ''
    // };

    if (newCost === undefined) {
      return undefined;
    }

    const point = {
      'name': this.count,
      'value': +newCost,
      'max': +newCost * 0.5,
      'min': +newCost * 1.5
    };

    return point;
  }

  add2Chart(point: any): void {

    if (point !== undefined) {
      this.multi[0].series.push(point);
      this.multi = [...this.multi];
      this.count++;
    }


  }

}
