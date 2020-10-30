import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RunOptimizationDialogData } from './run-optimization-data.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

//import { InputOptimizationDataService } from '../../inputDataService/input-optimization-data.service';

import { JOptOpeningHours, JOptGeoNode, JOptOptimizationRunOptions, JOptOptimizationOutput } from 'build/openapi';
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
    @Inject(MAT_DIALOG_DATA) public data: RunOptimizationDialogData) {

    if (this.dataService === undefined) {
      this.openSnackBar('Input is not valid', 'Invalid');
      this.dialogRef.close();
    }

    console.log('::Starting optimization::');
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
    this.dataService.stopOptimization().pipe(take(1)).subscribe((watcherEvent: boolean) => {

      //console.log('watcherEvent', watcherEvent);
      this.openSnackBar('Optimization stoped', 'Ok');
    },
      (error) => {
        console.log('error', error);
        this.openSnackBar('Error', error);
      },
      () => {
        console.log('Completed')
        this.openSnackBar('Optimization stoped', 'Ok');
      })
  }


  private startOptimization(): void {

    console.log('::STARTING OPTIMIZATION::');

    this.dataService.startOptimization().pipe(take(1)).subscribe(
      (optimizationResult: JOptOptimizationOutput) => {


        //console.log(optimizationResult);
        //this.openSnackBar('Optimization done', 'ok');
        this.dialogRef.close();

        // Open Result dialog
        console.log('Open Result dialog');
        this.openOptimizationResultDialog(optimizationResult);

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

  openOptimizationResultDialog(output: JOptOptimizationOutput): void {
    //console.log(output);
    const dialogRef = this.dialog.open(OptimizationResultDialogComponent, {
        width: '1000px',
        maxHeight: '80vh',
        data: { result: output }
    });

    dialogRef.afterClosed().subscribe(result => {


        //const runDialogRef: MatDialogRef<RunOptimizationDialogComponent> = result;

        //runDialogRef.afterClosed().subscribe(optimizationResult => {
        //  console.log('Got optimization result: ' + optimizationResult);
        //});

    });


}


}
