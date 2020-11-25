import { Component, OnInit, OnDestroy, NgZone, OnChanges } from '@angular/core';

import {timer, Subject, Observable,interval,of, throwError, iif } from 'rxjs';

import { takeUntil,mergeMap,retry, tap, retryWhen, delayWhen, concatMap, delay   } from 'rxjs/operators';

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

  unfilteredLatestProgress$: Observable<JOptOptimizationProgress>;

  constructor(
    private readonly eventService: EventSourceService,
    private cd: ChangeDetectorRef
  ) { }



  ngOnInit(): void {

    // Create an observable that waits until a porgress is reported

    this.unfilteredLatestProgress$ = this.eventService.progress();

/*     this.latestProgress$ = this.unfilteredLatestProgress$.pipe(
      mergeMap(progress => {
        //throw error for demonstration
        if (progress.curProgress < 0) {
          console.log('No ready: '+progress.curProgress);
          return throwError('Error!');
        }
        return of(progress);
      }),
      //retry 2 times on error
      retry(10)
    ); */

/*     this.latestProgress$ = this.unfilteredLatestProgress$.pipe(
      mergeMap(progress => {
        //throw error for demonstration
        if (progress.curProgress < 0) {
          console.log('No ready: '+progress.curProgress);
          return throwError('Error!');
        }
        return of(progress);
      }),
      retryWhen(errors =>
        errors.pipe(
          //log error message
          //console.log('Retry after 200ms');
          //restart in 1 seconds
          delayWhen(val => timer(200))
        )
      )
    ); */

    this.latestProgress$ = this.unfilteredLatestProgress$.pipe(
      mergeMap(progress => {
        //throw error for demonstration
        if (progress.curProgress < 0) {
          //console.log('No ready: ' + progress.curProgress);
          return throwError('Error!');
        }
        return of(progress);
      }),
      retryWhen(errors =>

        errors.pipe(
          // Use concat map to keep the errors in order and make sure they
          // aren't executed in parallel
          concatMap((e, i) =>
            // Executes a conditional Observable depending on the result
            // of the first argument
            iif(
              () => i > 30,
              // If the condition is true we throw the error (the last error)
              throwError(e),
              // Otherwise we pipe this back into our stream and delay the retry
              of(e).pipe(delay(200))
            )

          )
        )
        //errors.pipe(
        //  delayWhen(val => timer(200))
        //)
      )
    );

    this.latestProgress$.subscribe((progress) => {
      this.cd.detectChanges();
    });

  }


/*   extractCost(desc: string): string {

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
  } */


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
