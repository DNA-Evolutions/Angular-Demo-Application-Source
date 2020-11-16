import { Component, Input, OnInit, Inject, AfterViewInit } from '@angular/core';

import { JOptOptimizationOutput } from 'build/openapi';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-opti-result-dialog',
  templateUrl: 'opti-rawr-dialog.component.html',
  styleUrls: ['./opti-rawr-dialog.component.scss'],
})
export class OptimizationRawRDialogComponent implements OnInit {
  //
  @Input() result: JOptOptimizationOutput;

  curResult?: JOptOptimizationOutput;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OptimizationRawRDialogComponent>
  ) {}

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

  ngOnInit(): void {
    this.extractResult();
  }

  //

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
