import { CollectionViewer, DataSource } from '@angular/cdk/collections';

import { map } from 'rxjs/operators';

import { Observable, concat, defer, of, combineLatest } from 'rxjs';
import { Sort, MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';


/**
 * Used for pagination
 *
 * @export
 * @class SimpleDataSource
 * @extends {DataSource<T>}
 * @template T
 */
export class SimpleDataSource<T> extends DataSource<T> {
  constructor(private rows$: Observable<T[]>) {
    super();
  }
  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    return this.rows$;
  }
  disconnect(collectionViewer: CollectionViewer): void {}
}

function defaultSort(a: any, b: any): number {
  //treat null === undefined for sorting
  a = a === undefined ? null : a;
  b = b === undefined ? null : b;

  if (a === b) {
    return 0;
  }
  if (a === null) {
    return -1;
  }
  if (b === null) {
    return 1;
  }

  //from this point on a & b can not be null or undefined.

  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  } else {
    return 0;
  }
}

type SortFn<U> = (a: U, b: U) => number;
interface PropertySortFns<U> {
  [prop: string]: SortFn<U>;
}

/** RxJS operator to map a material Sort object to a sort function */
function toSortFn<U>(
  sortFns: PropertySortFns<U> = {},
  useDefault = true
): (sort$: Observable<Sort>) => Observable<undefined | SortFn<U>> {
  return (sort$) =>
    sort$.pipe(
      map((sort) => {
        if (!sort.active || sort.direction === '') {
          return undefined;
        }

        let sortFn = sortFns[sort.active];
        if (!sortFn) {
          if (!useDefault) {
            throw new Error(`Unknown sort property [${sort.active}]`);
          }

          //By default assume sort.active is a property name, and sort using the default sort
          //  uses < and >.
          sortFn = (a: U, b: U) =>
            defaultSort((<any>a)[sort.active], (<any>b)[sort.active]);
        }

        return sort.direction === 'asc' ? sortFn : (a: U, b: U) => sortFn(b, a);
      })
    );
}

/** Creates an Observable stream of Sort objects from a MatSort component */
export function fromMatSort(sort: MatSort): Observable<Sort> {
  return concat(
    defer(() =>
      of({
        active: sort.active,
        direction: sort.direction,
      })
    ),
    sort.sortChange.asObservable()
  );
}

/** RxJs operator to sort an array based on an Observable of material Sort events **/
export function sortRows<U>(
  sort$: Observable<Sort>,
  sortFns: PropertySortFns<U> = {},
  useDefault = true
): (obs$: Observable<U[]>) => Observable<U[]> {
  return (rows$: Observable<U[]>) =>
    combineLatest(
      rows$,
      sort$.pipe(toSortFn(sortFns, useDefault)),
      (rows, sortFn) => {
        if (!sortFn) {
          return rows;
        }

        const copy = rows.slice();
        return copy.sort(sortFn);
      }
    );
}

/** Creates an Observable stream of PageEvent objects from a MatPaginator component */
export function fromMatPaginator(pager: MatPaginator): Observable<PageEvent> {
  return concat(
    defer(() =>
      of({
        pageIndex: pager.pageIndex,
        pageSize: pager.pageSize,
        length: pager.length,
      })
    ),
    pager.page.asObservable()
  );
}

/** RxJs operator to paginate an array based on an Observable of PageEvent objects **/
export function paginateRows<U>(
  page$: Observable<PageEvent>
): (obs$: Observable<U[]>) => Observable<U[]> {
  return (rows$: Observable<U[]>) =>
    combineLatest(rows$, page$, (rows, page) => {
      const startIndex = page.pageIndex * page.pageSize;
      const copy = rows.slice();
      return copy.splice(startIndex, page.pageSize);
    });
}
