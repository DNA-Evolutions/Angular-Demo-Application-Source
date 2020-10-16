import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrepareRunOptimizationDialogData } from './prepare-run-optimization-data.interface';
import { RunOptimizationDialogComponent } from './run-optimization-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

//import { InputOptimizationDataService } from '../../inputDataService/input-optimization-data.service';

import { JOptOpeningHours, JOptGeoNode, JOptOptimizationRunOptions, JOptOptimizationOutput } from 'build/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';

@Component({
  selector: 'app-prepare-run-optimization-dialog',
  templateUrl: 'prepare-run-optimization-dialog.component.html',
})
export class PrepareRunOptimizationDialogComponent {

  curSettings: JOptOptimizationRunOptions;

  // Copies
  settingsCopy: JOptOptimizationRunOptions;

  constructor(
    private dataService: OptimizationWrapperService,
    private snackBar: MatSnackBar,
    public prepareDialogRef: MatDialogRef<PrepareRunOptimizationDialogComponent>,
    public runDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: PrepareRunOptimizationDialogData) {

    this.curSettings = this.dataService.optimizerSettings();

    if (this.curSettings === undefined) {
      this.openSnackBar('Input is not valid', 'Invalid');
      this.prepareDialogRef.close();
    }

    // Create a deep copy of settings, so that user changes do not
    // directly reflect in the object without saving
    this.settingsCopy = JSON.parse(JSON.stringify(this.curSettings));

  }

  getMaxPropertyValue(key: string): string {
    if (key === 'JOpt.Algorithm.PreOptimization.SA.NumIterations') {
      return '500000';
    }

    if (key === 'JOptExitCondition.JOptGenerationCount') {
      return '10000';
    }

    return '100';
  }

  getStepPropertyValue(key: string): string {
    if (key === 'JOpt.Algorithm.PreOptimization.SA.NumIterations') {
      return '10000';
    }

    if (key === 'JOptExitCondition.JOptGenerationCount') {
      return '1000';
    }

    return '1';
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 1000,
    });
  }

  openRunDialog(): MatDialogRef<RunOptimizationDialogComponent> {
    const dialogRef = this.runDialog.open(RunOptimizationDialogComponent, {
      width: '450px',
      disableClose: true,
      data: {  }
    });

    // dialogRef.afterClosed().subscribe(result => {

    // console.log('RunOptimizationViewComponent was closed: ' + result);

    // });

    return dialogRef;

  }

  onStartClick(): void {
    this.dataService.setOptimizerSettings(this.settingsCopy);
    this.openRunDialog();
    this.prepareDialogRef.close();
  }


  // onStartClickOld(): void {
  //   console.log('RunOptimizationDialogComponent starting optimization.');

  //   this.dataService.setOptimizerSettings(this.settingsCopy);

  //   this.dataService.startOptimization().subscribe(
  //     (watcherEvent: JOptOptimizationOutput) => {

  //       console.log('success');
  //       console.log(watcherEvent);

  //       //this.ngZone.run(() => {
  //       //  //this.latestProgressValue = watcherEvent;
  //       //  this.latestProgress = watcherEvent;
  //       //});
  //     },
  //     (error) => console.log('error', error),
  //     () => {
  //       console.log('Completed')
  //       this.openSnackBar('Optimization done', 'Ok');
  //     }
  //   )
  // }


  onNoClick(): void {
    console.log('RunOptimizationDialogComponent closing without saving.');
    this.openSnackBar('Cancelling', 'Ok');
    this.prepareDialogRef.close();
  }

}
