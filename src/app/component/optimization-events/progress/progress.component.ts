import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject, Observable, of, throwError, iif } from 'rxjs';

import { mergeMap, retryWhen, concatMap, delay } from 'rxjs/operators';

import { JOptOptimizationProgress } from '@openapibuild/openapi';

import { ChangeDetectorRef } from '@angular/core';
import { EventSourceService } from 'src/app/_services/optimization-event/event-source.service';

/**
 * Component to extract the progress of the currently running optimization
 *
 * @export
 * @class ProgressComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
    selector: 'app-progress',
    templateUrl: './progress.component.html',
    standalone: false
})
export class ProgressComponent implements OnInit, OnDestroy {
  unsubscribe$: Subject<void> = new Subject<void>();

  /**
   * Latest progress, excluding "-1" state, in case optimization was not started yet
   *
   * @type {Observable<JOptOptimizationProgress>}
   * @memberof ProgressComponent
   */
  latestProgress$: Observable<JOptOptimizationProgress>;

  /**
   *
   * Raw latest progress, inlcuding "-1" state, in case optimization was not started yet
   *
   * @type {Observable<JOptOptimizationProgress>}
   * @memberof ProgressComponent
   */
  unfilteredLatestProgress$: Observable<JOptOptimizationProgress>;

  /**
   * Creates an instance of ProgressComponent.
   * @param {EventSourceService} eventService
   * @param {ChangeDetectorRef} cd
   * @memberof ProgressComponent
   */
  constructor(
    private readonly eventService: EventSourceService,
    private cd: ChangeDetectorRef
  ) {}

  /**
   * Filter the progress on init
   *
   * @memberof ProgressComponent
   */
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

  /**
   * Detach from progress observable
   *
   * @memberof ProgressComponent
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
