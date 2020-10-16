import { Component, OnInit, OnDestroy, NgZone, OnChanges } from '@angular/core';

import { Subject, Observable } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

import { JOptOptimizationProgress } from 'build/openapi';
//import { EventSourceService } from '../../eventService/event-source.service';

import { BrowserModule } from '@angular/platform-browser';

import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { EventSourceService } from 'src/app/_services/optimization-event/event-source.service';


@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressComponent implements OnInit, OnDestroy {

  unsubscribe$: Subject<void> = new Subject<void>();
  latestProgress$: Observable<JOptOptimizationProgress>;

  constructor(
    private readonly eventService: EventSourceService,
    private cd: ChangeDetectorRef
  ) { }



  ngOnInit(): void {


    this.latestProgress$ = this.eventService.progress();

    this.latestProgress$.subscribe((progress) => {
      this.cd.detectChanges();
    });

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

}
