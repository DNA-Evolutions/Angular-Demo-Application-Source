import {
  Component,
  Input,
  OnInit,
  Inject,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { ViewChild } from '@angular/core';

import {
  RouteElementDetail,
  Route,
  RestOptimization,
} from '@openapibuild/openapi';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { Sort, MatSort } from '@angular/material/sort';
import {
  fromMatSort,
  fromMatPaginator,
  sortRows,
  paginateRows,
} from '../../../shared/datasource-utils';
import { RouteResultDialogComponent } from '../../route/route-result/route-result-dialog.component';
import { OptimizationRawRDialogComponent } from '../optimization-raw-result/opti-rawr-dialog.component';

/**
 * Component to show the Optimization result. An overview of the solutions, as well as
 * buttons for each individual route result is shown.
 *
 * @export
 * @class OptimizationResultDialogComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 */
@Component({
    selector: 'app-opti-result-dialog',
    templateUrl: 'opti-result-dialog.component.html',
    styleUrls: ['./opti-result-dialog.component.scss'],
    standalone: false
})
export class OptimizationResultDialogComponent
  implements OnInit, AfterViewInit {
  /**
   * In case the dialog needs to be opened with an existing result, the
   * existing result can be provided as input.
   *
   * @type {JOptOptimizationOutput}
   * @memberof OptimizationResultDialogComponent
   */
  @Input() result: RestOptimization;

  /**
   * The current result used by the component.
   *
   * @type {JOptOptimizationOutput}
   * @memberof OptimizationResultDialogComponent
   */
  curResult?: RestOptimization;

  /**
   *
   * Some helper vars for representation
   *
   */
  expandedElement: RouteElementDetail | null;

  /** Observable of the currently displayed (paginated and sorted) route rows. */
  displayedRows$: Observable<Route[]>;

  /** Observable of the total number of route rows, used by the paginator. */
  totalRows$: Observable<number>;

  /** Reference to the Material paginator component for route result pagination. */
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  /** Reference to the Material sort header for sortable route result columns. */
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  /** Tracks whether the expansion panel is open or closed. */
  public panelOpenState: boolean;

  /** Index of the currently active expansion panel step; -1 means none is open. */
  step = -1;

  /**
   * Creates an instance of OptimizationResultDialogComponent.
   * @param {*} data
   * @param {ChangeDetectorRef} cdRef
   * @param {MatDialog} dialog
   * @param {MatDialogRef<OptimizationResultDialogComponent>} dialogRef
   * @memberof OptimizationResultDialogComponent
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OptimizationResultDialogComponent>
  ) {}

  /**
   * Extracts the optimization result from available sources.
   *
   * @description Checks the `@Input() result` property first, then falls back to
   * the dialog data injection. Sets {@link curResult} with the resolved value.
   *
   * @private
   * @memberof OptimizationResultDialogComponent
   */
  private extractResult(): void {
    if (this.result !== undefined) {
      this.curResult = this.result;
    }

    if (this.result === undefined) {
      this.curResult = this.data.result;

      if (this.curResult !== undefined) {
        // Found existing result
      } else {
        // Found no result
      }
    }
  }

  /**
   * On Init extract the result.
   *
   * @memberof OptimizationResultDialogComponent
   */
  ngOnInit(): void {
    this.extractResult();
  }

  /**
   * After view init paginate the route results
   *
   * @memberof OptimizationResultDialogComponent
   */
  ngAfterViewInit(): void {
    //
    if (this.curResult !== undefined) {
      //console.log(this.sort);
      const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
      const pageEvents$: Observable<PageEvent> = fromMatPaginator(
        this.paginator
      );

      const rows$ = of(this.curResult.solution?.routes ?? []);

      this.totalRows$ = rows$.pipe(map((rows) => rows.length));
      this.displayedRows$ = rows$.pipe(
        sortRows(sortEvents$),
        paginateRows(pageEvents$)
      );

      this.cdRef.detectChanges();
    }
  }

  //

  /**
   *
   * Counter for route result panels
   *
   * @param {number} index
   * @memberof OptimizationResultDialogComponent
   */
  setStep(index: number): void {
    this.step = index;
  }

  /**
   * Advances to the next route result expansion panel.
   *
   * @memberof OptimizationResultDialogComponent
   */
  nextStep(): void {
    this.step++;
  }

  /**
   * Returns to the previous route result expansion panel.
   *
   * @memberof OptimizationResultDialogComponent
   */
  prevStep(): void {
    this.step--;
  }

  /**
   * Open the individual route results
   *
   * @param {JOptRoute} curRoute
   * @memberof OptimizationResultDialogComponent
   */
  openRouteResultDialog(curRoute: Route): void {
    const dialogRef = this.dialog.open(RouteResultDialogComponent, {
      minWidth: '40vw',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { route: curRoute },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  /**
   * Opens the raw optimization result dialog showing the JSON/text representation.
   *
   * @description Opens the {@link OptimizationRawRDialogComponent} with the current
   * optimization result data for inspection of the raw API response.
   *
   * @memberof OptimizationResultDialogComponent
   */
  openRawResultDialog(): void {
    const dialogRef = this.dialog.open(OptimizationRawRDialogComponent, {
      minWidth: '40vw',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { result: this.curResult },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  /**
   * Closes the optimization result dialog.
   *
   * @memberof OptimizationResultDialogComponent
   */
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
