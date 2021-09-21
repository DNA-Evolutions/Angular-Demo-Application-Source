import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RunOptimizationDialogData } from './run-optimization-data.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RestOptimization } from 'build/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { OptimizationResultDialogComponent } from '../optimization-elements/result/optimization/optimization-result/opti-result-dialog.component';
import { concatMap, take, timeout } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
/**
 *
 *
 * @export
 * @class RunOptimizationDialogComponent
 */
@Component({
  selector: 'app-run-optimization-dialog',
  templateUrl: 'run-optimization-dialog.component.html',
})
export class RunOptimizationDialogComponent {
  constructor(
    private dataService: OptimizationWrapperService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<RunOptimizationDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: RunOptimizationDialogData
  ) {
    if (this.dataService === undefined) {
      this.openSnackBar('Input is not valid', 'Invalid');
      this.dialogRef.close();
    }

    this.startOptimization();
  }
  /**
   *
   *
   * @param {string} message
   * @param {string} action
   * @memberof RunOptimizationDialogComponent
   */
  openSnackBar(message: string, action: string): void {
    this.openSnackBarFor(message, action, 1000);
  }
  /**
   *
   *
   * @param {string} message
   * @param {string} action
   * @param {number} durationMillis
   * @memberof RunOptimizationDialogComponent
   */
  openSnackBarFor(
    message: string,
    action: string,
    durationMillis: number
  ): void {
    this.snackBar.open(message, action, {
      duration: durationMillis,
    });
  }
  /**
   *
   *
   * @memberof RunOptimizationDialogComponent
   */
  stopOptimizationGracefully(): void {
    this.openSnackBar('Stoping optimization gracefully', 'ok');
    this.dataService
      .stopOptimization()
      .pipe(take(1))
      .subscribe(
        () => {
          this.openSnackBar('Optimization stoped', 'Ok');
        },
        (error) => {
          console.log('error', error);
          this.openSnackBar('Error', error);
        },
        () => {
          this.openSnackBar('Optimization stoped', 'Ok');
        }
      );
  }

  // STARTING OPTIMIZATION

  /**
   * First, the health endpoint is called. If healty, the optimization is started
   *
   * @private
   * @memberof RunOptimizationDialogComponent
   */
  private startOptimization(): void {
    // Get the healt observable
    const healthStatus$ = this.dataService.getEndPointStatus();

    // 10 seconds maximal time to extract status
    const healthTimeOut = 10000;

    // Concat startOptimization with health
    const validatedResult$ = healthStatus$.pipe(
      timeout(healthTimeOut),
      concatMap((val) => this.dataService.startOptimization(val))
    );

    validatedResult$.pipe(take(1)).subscribe(
      (optimizationResult: RestOptimization) => {
        this.dialogRef.close();

        this.openOptimizationResultDialog(optimizationResult);
      },
      (error) => {
        console.log('error', error);
        if (error instanceof HttpErrorResponse) {
          this.openSnackBarFor('Error', error.name, 5000);
        } else if (error.message !== undefined) {
          this.openSnackBarFor('Error', error.message, 5000);
        } else {
          this.openSnackBar('Error', 'Something unexpected happened');
        }

        this.dialogRef.close();
      },
      () => {
        this.dialogRef.close();
      }
    );
  }

  /**
   *
   *
   * @param {RestOptimization} output
   * @memberof RunOptimizationDialogComponent
   */
  openOptimizationResultDialog(output: RestOptimization): void {
    const dialogRef = this.dialog.open(OptimizationResultDialogComponent, {
      minWidth: '40%',
      maxWidth: '95%',
      maxHeight: '85vh',
      data: { result: output },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
}
