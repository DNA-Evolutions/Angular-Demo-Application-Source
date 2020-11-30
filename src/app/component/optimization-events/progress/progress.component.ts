import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject, Observable, of, throwError, iif } from 'rxjs';

import { mergeMap, retryWhen, concatMap, delay } from 'rxjs/operators';

import { JOptOptimizationProgress } from 'build/openapi';

import { ChangeDetectorRef } from '@angular/core';
import { EventSourceService } from 'src/app/_services/optimization-event/event-source.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
})
export class ProgressComponent implements OnInit, OnDestroy {
  unsubscribe$: Subject<void> = new Subject<void>();
  latestProgress$: Observable<JOptOptimizationProgress>;

  unfilteredLatestProgress$: Observable<JOptOptimizationProgress>;

  constructor(
    private readonly eventService: EventSourceService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Create an observable that waits until a porgress is reported

    this.unfilteredLatestProgress$ = this.eventService.progress();

    this.latestProgress$ = this.unfilteredLatestProgress$.pipe(
      mergeMap((progress) => {
        //throw error for demonstration
        if (progress.curProgress < 0) {
          return throwError('Error!');
        }
        return of(progress);
      }),
      retryWhen((errors) =>
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
      )
    );

    this.latestProgress$.subscribe(() => {
      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
