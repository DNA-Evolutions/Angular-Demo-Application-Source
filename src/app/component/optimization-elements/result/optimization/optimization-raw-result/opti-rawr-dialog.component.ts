import { Component, Input, OnInit, Inject, AfterViewInit } from '@angular/core';

import { JSONConfig, RestOptimization, TextSolution } from '@openapibuild/openapi';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { EXTERNAL_LINKS } from 'src/app/_config/external-links';

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
    standalone: false
})
export class OptimizationRawRDialogComponent implements OnInit {
  readonly links = EXTERNAL_LINKS;

  /** Optimization result passed as an input binding (alternative to dialog data). */
  @Input() result: RestOptimization;

  /** The resolved optimization result used for display. */
  curResult?: RestOptimization;

  /** The text-based solution representation extracted from the result extension, if available. */
  textSolution?: TextSolution;

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
   * Extracts the optimization result from available sources.
   *
   * @description Checks the `@Input() result` property first, then falls back to
   * the dialog data injection. If the result contains an extension with a
   * {@link TextSolution}, it is extracted for display.
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
        if (this.curResult.extension !== undefined) {
         this.textSolution = (this.curResult.extension as JSONConfig).textSolution;
        }

      } else {
        //Found no result;
      }
    }
  }

  /**
   * Lifecycle hook that extracts the optimization result on component initialization.
   *
   * @memberof OptimizationRawRDialogComponent
   */
  ngOnInit(): void {
    this.extractResult();
  }

  /**
   * Closes the raw result dialog.
   *
   * @memberof OptimizationRawRDialogComponent
   */
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
