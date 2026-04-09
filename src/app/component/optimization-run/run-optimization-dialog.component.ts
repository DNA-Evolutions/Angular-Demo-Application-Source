import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RunOptimizationDialogData } from './run-optimization-data.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RestOptimization } from '@openapibuild/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { OptimizationResultDialogComponent } from '../optimization-elements/result/optimization/optimization-result/opti-result-dialog.component';
import { concatMap, take, timeout } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
/**
 * Dialog component that executes the optimization and displays progress.
 *
 * @description This dialog is opened after the user confirms settings in the prepare dialog.
 * It first validates the health status of the optimizer endpoint, then starts the optimization.
 * Upon completion, the result dialog is opened. If an error occurs (e.g., endpoint unreachable
 * or timeout), the user is notified via a snack bar and the dialog closes.
 *
 * @export
 * @class RunOptimizationDialogComponent
 */
@Component({
    selector: 'app-run-optimization-dialog',
    templateUrl: 'run-optimization-dialog.component.html',
    standalone: false
})
export class RunOptimizationDialogComponent {
  /**
   * Creates an instance of RunOptimizationDialogComponent.
   *
   * @description Validates the data service and immediately starts the optimization process.
   *
   * @param {OptimizationWrapperService} dataService - Service providing optimization operations.
   * @param {MatSnackBar} snackBar - Snack bar for user notifications.
   * @param {MatDialogRef<RunOptimizationDialogComponent>} dialogRef - Reference to this dialog.
   * @param {MatDialog} dialog - Dialog service for opening the result dialog.
   * @param {RunOptimizationDialogData} data - Data injected into this dialog.
   */
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
   * Displays a snack bar notification with a default duration of 1 second.
   *
   * @param {string} message - The message text to display.
   * @param {string} action - The label for the snack bar dismiss button.
   */
  openSnackBar(message: string, action: string): void {
    this.openSnackBarFor(message, action, 1000);
  }
  /**
   * Displays a snack bar notification with a custom duration.
   *
   * @param {string} message - The message text to display.
   * @param {string} action - The label for the snack bar dismiss button.
   * @param {number} durationMillis - How long the snack bar stays visible, in milliseconds.
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
   * Sends a request to gracefully stop the currently running optimization.
   *
   * @description Calls the data service to stop the optimization. The optimizer will finish
   * its current iteration and return the best result found so far.
   */
  stopOptimizationGracefully(): void {
    this.openSnackBar('Stopping optimization gracefully', 'ok');
    this.dataService
      .stopOptimization()
      .pipe(take(1))
      .subscribe(
        () => {
          this.openSnackBar('Optimization stopped', 'Ok');
        },
        (error) => {
          console.log('error', error);
          this.openSnackBar('Error', error);
        },
        () => {
          this.openSnackBar('Optimization stopped', 'Ok');
        }
      );
  }

  // STARTING OPTIMIZATION

  /**
   * Validates the optimizer health endpoint and starts the optimization.
   *
   * @description First calls the health endpoint with a 10-second timeout. If the endpoint
   * is healthy, the optimization is started via {@link OptimizationWrapperService.startOptimization}.
   * On success, the result dialog is opened. On error (HTTP error, timeout, or unexpected
   * failure), the user is notified and the dialog is closed.
   *
   * @private
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

    validatedResult$.pipe(take(1)).subscribe({
      next: (optimizationResult: RestOptimization) => {
        this.dialogRef.close();
        this.openOptimizationResultDialog(optimizationResult);
      },
      error: (error) => {
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
      complete: () => {
        this.dialogRef.close();
      }
    });
  }

  /**
   * Opens the optimization result dialog to present the completed optimization output.
   *
   * @param {RestOptimization} output - The optimization result to display.
   */
  openOptimizationResultDialog(output: RestOptimization): void {
    const dialogRef = this.dialog.open(OptimizationResultDialogComponent, {
      minWidth: '80vw',
      maxWidth: '95vw',
      maxHeight: '85vh',
      data: { result: output },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
}
