import { Component, Input, OnInit, Inject, AfterViewInit } from '@angular/core';

import { JOptOptimizationOutput } from 'build/openapi';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

/**
 * Component to show the Raw result of an optimization run.
 *
 * @export
 * @class OptimizationRawRDialogComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-opti-result-dialog',
  templateUrl: 'opti-rawr-dialog.component.html',
  styleUrls: ['./opti-rawr-dialog.component.scss'],
})
export class OptimizationRawRDialogComponent implements OnInit {
  //
  @Input() result: JOptOptimizationOutput;

  curResult?: JOptOptimizationOutput;

  /**
   * Creates an instance of OptimizationRawRDialogComponent.
   * @param {*} data
   * @param {MatDialog} dialog
   * @param {MatDialogRef<OptimizationRawRDialogComponent>} dialogRef
   * @memberof OptimizationRawRDialogComponent
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OptimizationRawRDialogComponent>
  ) {}

  /**
   *
   *
   * @private
   * @memberof OptimizationRawRDialogComponent
   */
  private extractResult(): void {
    if (this.result !== undefined) {
      this.curResult = this.result;
    }

    if (this.result === undefined) {
      this.curResult = this.data.result;

      if (this.curResult !== undefined) {
        //Found existing result;
      } else {
        //Found no result;
      }
    }
  }

  /**
   *
   *
   * @memberof OptimizationRawRDialogComponent
   */
  ngOnInit(): void {
    this.extractResult();
  }

  /**
   *
   *
   * @memberof OptimizationRawRDialogComponent
   */
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
