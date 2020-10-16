import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RunOptimizationDialogData } from './run-optimization-data.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

//import { InputOptimizationDataService } from '../../inputDataService/input-optimization-data.service';

import { JOptOpeningHours, JOptGeoNode, JOptOptimizationRunOptions, JOptOptimizationOutput } from 'build/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';

@Component({
  selector: 'app-run-optimization-dialog',
  templateUrl: 'run-optimization-dialog.component.html',
})
export class RunOptimizationDialogComponent {



  constructor(
    private dataService: OptimizationWrapperService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<RunOptimizationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RunOptimizationDialogData) {

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
    console.log('Stoping optimization gracefully');
    this.openSnackBar('Stoping optimization gracefully', 'ok');
    this.dataService.stopOptimization().subscribe((watcherEvent: boolean) => {

      console.log('watcherEvent', watcherEvent);
      this.openSnackBar('Optimization stoped', 'Ok');
    },
      (error) => {
        console.log('error', error);
        this.openSnackBar('Error', 'Error');
      },
      () => {
        console.log('Completed')
        this.openSnackBar('Optimization stoped', 'Ok');
      })
  }


  private startOptimization(): void {

    this.dataService.startOptimization().subscribe(
      (optimizationResult: JOptOptimizationOutput) => {

        //console.log('Got optimization result');
        //console.log(optimizationResult);
        this.openSnackBar('Optimization done', 'ok');
      this.dialogRef.close();
      },
      (error) => {
        console.log('error', error);
        this.openSnackBar('Error', 'Error');
        this.dialogRef.close();
      },
      () => {
        console.log('Completed')
        this.dialogRef.close();
      }
    )
  }


}
