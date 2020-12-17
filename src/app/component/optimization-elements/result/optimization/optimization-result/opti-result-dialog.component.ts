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
  JOptRouteElementDetail,
  JOptRoute,
  JOptOptimizationOutput,
} from 'build/openapi';

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
  @Input() result: JOptOptimizationOutput;

  /**
   * The current result used by the component.
   *
   * @type {JOptOptimizationOutput}
   * @memberof OptimizationResultDialogComponent
   */
  curResult?: JOptOptimizationOutput;

  /**
   *
   * Some helper vars for representation
   *
   */
  expandedElement: JOptRouteElementDetail | null;

  // For pagination
  displayedRows$: Observable<JOptRoute[]>;
  totalRows$: Observable<number>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public panelOpenState: boolean;

  // During next and prev in nodes
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
   *
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

      const rows$ = of(this.curResult.solution.routes);

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
   *
   *
   * @memberof OptimizationResultDialogComponent
   */
  nextStep(): void {
    this.step++;
  }

  /**
   *
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
  openRouteResultDialog(curRoute: JOptRoute): void {
    const dialogRef = this.dialog.open(RouteResultDialogComponent, {
      minWidth: '40%',
      maxWidth: '95%',
      maxHeight: '90%',
      data: { route: curRoute },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  /**
   *
   *
   * @memberof OptimizationResultDialogComponent
   */
  openRawResultDialog(): void {
    const dialogRef = this.dialog.open(OptimizationRawRDialogComponent, {
      minWidth: '40%',
      maxWidth: '95%',
      maxHeight: '90%',
      data: { result: this.curResult },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  /**
   *
   *
   * @memberof OptimizationResultDialogComponent
   */
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
