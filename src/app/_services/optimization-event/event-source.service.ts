import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import _ from 'lodash';

import { environment } from '@env/environment';

/**
 * Service for subscribing to Server-Sent Events (SSE) from the JOpt optimization backend.
 *
 * This service wraps the browser's native {@link EventSource} API and exposes RxJS observables
 * for consuming real-time progress updates and warning streams during an optimization run.
 * It handles automatic reconnection with a configurable retry limit and manages the
 * lifecycle of event source connections (including detection of completed/not-started states).
 *
 * Typical usage:
 * 1. Call {@link progress} or {@link newProgressObservable} with a run ID to receive optimization progress events.
 * 2. Call {@link newWarningObservable} with a run ID to receive optimization warning events.
 * 3. The returned observable will automatically close when the stream ends or retries are exhausted.
 *
 * @export
 * @class EventSourceService
 */
@Injectable({
  providedIn: 'root',
})
export class EventSourceService {
  /**
   * Creates an observable that emits parsed optimization progress events for a given run.
   *
   * This is the primary method for monitoring optimization progress. Events are parsed
   * from JSON using the standard JSON.parse converter.
   *
   * @template JOptOptimizationProgress - The type representing an optimization progress event.
   * @param {string} runId - The unique identifier of the optimization run to monitor.
   * @returns {Observable<JOptOptimizationProgress>} An observable stream of progress events.
   * @memberof EventSourceService
   */
  progress<JOptOptimizationProgress>(runId: string): Observable<JOptOptimizationProgress> {
    return this.newObservable(
      environment.host + ':' + environment.port + '/api/v1/runs/' + runId + '/stream/progress',
      JSON.parse
    );
  }

  /**
   * Creates a typed observable for optimization progress events.
   *
   * Similar to {@link progress} but allows specifying a custom return type via the generic parameter.
   *
   * @template R - The expected type of each progress event after JSON parsing.
   * @param {string} runId - The unique identifier of the optimization run to monitor.
   * @returns {Observable<R>} An observable stream of typed progress events.
   * @memberof EventSourceService
   */
  newProgressObservable<R>(runId: string): Observable<R> {
    return this.newObservable(
      environment.host + ':' + environment.port + '/api/v1/runs/' + runId + '/stream/progress',
      JSON.parse
    );
  }

  /**
   * Creates a typed observable for optimization warning events.
   *
   * Subscribes to the warnings SSE endpoint for the given run and emits parsed
   * warning objects. Useful for displaying constraint violations or other
   * non-fatal issues during optimization.
   *
   * @template R - The expected type of each warning event after JSON parsing.
   * @param {string} runId - The unique identifier of the optimization run to monitor.
   * @returns {Observable<R>} An observable stream of typed warning events.
   * @memberof EventSourceService
   */
  newWarningObservable<R>(runId: string): Observable<R> {
    return this.newObservable(
      environment.host + ':' + environment.port + '/api/v1/runs/' + runId + '/stream/warnings',
      JSON.parse
    );
  }


  /**
   * Creates a new native browser EventSource for the given SSE endpoint URL.
   *
   * This is a thin wrapper that can be overridden in tests to provide mock event sources.
   *
   * @param {string} path - The full URL of the SSE endpoint to connect to.
   * @returns {EventSource} A new EventSource instance connected to the specified path.
   * @memberof EventSourceService
   */
  newEventSource(path: string): EventSource {
    return new EventSource(path);
  }


  /**
   * Creates an RxJS Observable that wraps a Server-Sent Events (SSE) connection.
   *
   * This is the core factory method used by all SSE observables in this service.
   * It manages the full lifecycle of the EventSource connection including:
   * - Converting raw SSE message data using the provided converter function.
   * - Detecting "NOT STARTED" sentinel messages and auto-completing the stream
   *   if the optimization has not yet begun (after 5 attempts) or has already
   *   transitioned past the started state and returned to "NOT STARTED".
   * - Retrying on errors up to the specified retry limit before erroring out.
   * - Cleaning up the EventSource connection when the observable is unsubscribed.
   *
   * @template R - The type that the converter function produces from raw event data.
   * @param {string} path - The full URL of the SSE endpoint.
   * @param {(data: string) => R} [converter=_.identity] - A function to transform raw event data strings into typed objects (defaults to identity/passthrough).
   * @param {number} [retryLimit=3] - The maximum number of error retries before the observable errors out.
   * @returns {Observable<R>} An observable that emits converted SSE events.
   * @memberof EventSourceService
   */
  newObservable<R>(
    path: string,
    converter: (data: string) => R = _.identity,
    retryLimit: number = 3
  ): Observable<R> {

    /** Counts consecutive "NOT STARTED" messages to detect a not-yet-running optimization. */
    let notStartedCounter = 0;
    /** Tracks whether the stream has transitioned beyond the "NOT STARTED" state. */
    let hasTransitioned = false;

    return new Observable((observer) => {
      let retryCount = 0;

      const eventSource = this.newEventSource(path);
      eventSource.onmessage = (event) => {

        const dataconv = converter(event.data);

        if (event.data.includes('NOT STARTED')) {
          notStartedCounter = notStartedCounter + 1;

          if (hasTransitioned || notStartedCounter > 5) {
            // If transitioned and "NOT STARTED" appears again, close the EventSource
            observer.complete(); // Notify the observer that the stream is complete
            eventSource.close(); // Close the EventSource
            return;
          }
        } else {
          // If other data is received, set or reset the transition state
          hasTransitioned = true;
        }


        observer.next(dataconv);
      };

      eventSource.onerror = () => {
        retryCount++;
        if (retryCount >= retryLimit) {
          observer.error('Max retry attempts reached.');
          eventSource.close();
          observer.complete();
        }
        // Optionally, you can add a delay before reconnecting
        // This can be done using setTimeout or similar mechanisms
      };

      return () => {
        eventSource.close();
      };
    });
  }
}
