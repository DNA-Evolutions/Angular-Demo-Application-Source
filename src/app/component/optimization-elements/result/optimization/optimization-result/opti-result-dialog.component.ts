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

@Component({
  selector: 'app-opti-result-dialog',
  templateUrl: 'opti-result-dialog.component.html',
  styleUrls: ['./opti-result-dialog.component.scss'],
})
export class OptimizationResultDialogComponent
  implements OnInit, AfterViewInit {
  // For pagination
  displayedRows$: Observable<JOptRoute[]>;
  totalRows$: Observable<number>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  //
  @Input() result: JOptOptimizationOutput;

  curResult?: JOptOptimizationOutput;

  expandedElement: JOptRouteElementDetail | null;

  public panelOpenState: boolean;

  // During next and prev in nodes
  step = -1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OptimizationResultDialogComponent>
  ) {}

  private extractResult(): void {
    if (this.result !== undefined) {
      this.curResult = this.result;
    }

    if (this.result === undefined) {
      this.curResult = this.data.result;

      if (this.curResult !== undefined) {
        //console.log('Found existing result');
      } else {
        // console.log('Found no result');
      }
    }
  }

  ngOnInit(): void {
    this.extractResult();
  }

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

  setStep(index: number): void {
    this.step = index;
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }

  openRouteResultDialog(curRoute: JOptRoute): void {
    const dialogRef = this.dialog.open(RouteResultDialogComponent, {
      width: '90%',
      maxHeight: '95vh',
      data: { route: curRoute },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  openRawResultDialog(): void {
    const dialogRef = this.dialog.open(OptimizationRawRDialogComponent, {
      width: '90%',
      maxHeight: '95vh',
      data: { result: this.curResult },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
