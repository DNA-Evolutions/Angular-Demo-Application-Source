import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject, Observable, of, throwError, iif } from 'rxjs';

import { mergeMap, retryWhen, concatMap, delay, switchMap, takeUntil } from 'rxjs/operators';

import { JOptOptimizationProgress } from '@openapibuild/openapi';

import { ChangeDetectorRef } from '@angular/core';
import { EventSourceService } from 'src/app/_services/optimization-event/event-source.service';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';

/**
 * Component that displays real-time progress of a running optimization.
 *
 * @description Subscribes to a Server-Sent Events (SSE) progress stream via the
 * {@link EventSourceService}. The raw progress observable may emit a special "-1" progress
 * value when the optimization has not started yet; this component filters those out and
 * retries with an exponential back-off (up to 30 retries with 200ms delays) before giving up.
 * Change detection is triggered manually on each progress update to keep the UI responsive.
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
  /** Subject used to signal unsubscription and clean up all active observables on destroy. */
  unsubscribe$: Subject<void> = new Subject<void>();

  /**
   * Latest progress, excluding "-1" state, in case optimization was not started yet
   *
   * @type {Observable<JOptOptimizationProgress>}
   * @memberof ProgressComponent
   */
  latestProgress$!: Observable<JOptOptimizationProgress>;

  /**
   *
   * Raw latest progress, inlcuding "-1" state, in case optimization was not started yet
   *
   * @type {Observable<JOptOptimizationProgress>}
   * @memberof ProgressComponent
   */
  unfilteredLatestProgress$!: Observable<JOptOptimizationProgress>;

  /**
   * Creates an instance of ProgressComponent.
   *
   * @param {EventSourceService} eventService - Service that provides SSE-based progress streams.
   * @param {OptimizationWrapperService} wrapperService - Wrapper service that holds the current run ID.
   * @param {ChangeDetectorRef} cd - Angular change detector, used to manually trigger UI updates.
   */
  constructor(
    private readonly eventService: EventSourceService,
    private readonly wrapperService: OptimizationWrapperService,
    private cd: ChangeDetectorRef
  ) {}

  /**
   * Initializes the progress observables on component creation.
   *
   * @description Waits for the run ID to become available from the wrapper service, then
   * subscribes to the SSE progress stream. The filtered `latestProgress$` observable retries
   * when progress is negative (optimization not yet started) and triggers manual change
   * detection on each emission to update the progress bar UI.
   */
  ngOnInit(): void {
    // Wait for the runId to become available, then subscribe to progress
    this.unfilteredLatestProgress$ = this.wrapperService.getRunId$().pipe(
      takeUntil(this.unsubscribe$),
      switchMap((runId) => this.eventService.progress<JOptOptimizationProgress>(runId))
    );

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
   * Cleans up subscriptions when the component is destroyed.
   *
   * @description Emits on the unsubscribe$ subject to complete all active observable
   * subscriptions and prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
