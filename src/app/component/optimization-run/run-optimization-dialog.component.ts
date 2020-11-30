import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RunOptimizationDialogData } from './run-optimization-data.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

import { JOptOptimizationOutput } from 'build/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { OptimizationResultDialogComponent } from '../optimization-elements/result/optimization/optimization-result/opti-result-dialog.component';
import { take } from 'rxjs/operators';

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

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 1000,
    });
  }

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

  private startOptimization(): void {
    // STARTING OPTIMIZATION;

    this.dataService
      .startOptimization()
      .pipe(take(1))
      .subscribe(
        (optimizationResult: JOptOptimizationOutput) => {
          this.dialogRef.close();

          this.openOptimizationResultDialog(optimizationResult);
        },
        (error) => {
          console.log('error', error);
          this.openSnackBar('Error', 'Error');
          this.dialogRef.close();
        },
        () => {
          this.dialogRef.close();
        }
      );
  }

  openOptimizationResultDialog(output: JOptOptimizationOutput): void {
    const dialogRef = this.dialog.open(OptimizationResultDialogComponent, {
      minWidth: '40%',
      maxWidth: '95%',
      maxHeight: '85vh',
      data: { result: output },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
}
