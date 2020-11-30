import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import _ from 'lodash';

import { environment } from './../../../environments/environment';

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
    converter: (data: string) => R = _.identity
  ): Observable<R> {
    return new Observable((observer) => {
      const eventSource = this.newEventSource(path);

      eventSource.onmessage = (event) => {
        observer.next(converter(event.data));
      };

      eventSource.onerror = () => {
        if (eventSource.readyState !== eventSource.CONNECTING) {
          observer.error('An error occurred.');
        }
        eventSource.close();
        observer.complete();
      };

      return () => {
        eventSource.close();
      };
    });
  }
}
