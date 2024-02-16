import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import _ from 'lodash';

import { environment } from '@env/environment';

/**
 * A generic service to request events from the swagger endpoint.
 *
 * @export
 * @class EventSourceService
 */
@Injectable({
  providedIn: 'root',
})
export class EventSourceService {
  progress<JOptOptimizationProgress>(): Observable<JOptOptimizationProgress> {
    return this.newObservable(
      environment.host + ':' + environment.port + environment.apiProgress,
      JSON.parse
    );
  }


  /**
   *
   *
   * @template R
   * @return {*}  {Observable<R>}
   * @memberof EventSourceService
   */
  newProgressObservable<R>(): Observable<R> {
    return this.newObservable(
      environment.host + ':' + environment.port + environment.apiProgress,
      JSON.parse
    );
  }


  /**
   *
   *
   * @template R
   * @return {*}  {Observable<R>}
   * @memberof EventSourceService
   */
  newWarningObservable<R>(): Observable<R> {
    return this.newObservable(
      environment.host + ':' + environment.port + environment.apiWarning,
      JSON.parse
    );
  }


  /**
   *
   *
   * @param {string} path
   * @return {*}  {EventSource}
   * @memberof EventSourceService
   */
  newEventSource(path: string): EventSource {
    return new EventSource(path);
  }


  /**
   *
   *
   * @template R
   * @param {string} path
   * @param {(data: string) => R} [converter=_.identity]
   * @return {*}  {Observable<R>}
   * @memberof EventSourceService
   */
  newObservable<R>(
    path: string,
    converter: (data: string) => R = _.identity,
    retryLimit: number = 3  // Default retry limit
  ): Observable<R> {

    let notStartedCounter = 0;
    let hasTransitioned = false; // State variable to track transition

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
