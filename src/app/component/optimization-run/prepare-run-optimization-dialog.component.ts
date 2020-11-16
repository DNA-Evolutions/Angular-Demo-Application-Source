import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PrepareRunOptimizationDialogData } from './prepare-run-optimization-data.interface';
import { RunOptimizationDialogComponent } from './run-optimization-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { JOptOptimizationRunOptions } from 'build/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';

@Component({
  selector: 'app-prepare-run-optimization-dialog',
  templateUrl: 'prepare-run-optimization-dialog.component.html',
  styleUrls: ['prepare-run-optimization-view.component.scss'],
})
export class PrepareRunOptimizationDialogComponent {
  curSettings: JOptOptimizationRunOptions;

  // Copies
  settingsCopy: JOptOptimizationRunOptions;

  constructor(
    private dataService: OptimizationWrapperService,
    private snackBar: MatSnackBar,
    public prepareDialogRef: MatDialogRef<
      PrepareRunOptimizationDialogComponent
    >,
    public runDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: PrepareRunOptimizationDialogData
  ) {
    this.curSettings = this.dataService.optimizerSettings();

    if (this.curSettings === undefined) {
      this.openSnackBar('Input is not valid', 'Invalid');
      this.prepareDialogRef.close();
    }

    // Create a deep copy of settings, so that user changes do not
    // directly reflect in the object without saving
    this.settingsCopy = JSON.parse(JSON.stringify(this.curSettings));
  }

  public isDisabledSliderValue(key: string): boolean {
    if (key === 'JOpt.Algorithm.PreOptimization.SA.NumIterations') {
      return true;
    }

    if (key === 'JOptExitCondition.JOptGenerationCount') {
      return true;
    }

    return false;
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

  getPropertyAbbr(key: string): string {
    if (key === 'JOpt.Algorithm.PreOptimization.SA.NumIterations') {
      return 'SA.NumIterations';
    }

    if (key === 'JOptExitCondition.JOptGenerationCount') {
      return 'GenerationCount';
    }

    if (key === 'JOptWeight.TimeWindow') {
      return 'JOptWeight.TimeWindow';
    }

    if (key === 'JOptWeight.RouteDistance') {
      return 'JOptWeight.RouteDistance';
    }

    if (key === 'JOptWeight.RouteTime') {
      return 'JOptWeight.RouteTime';
    }

    return key;
  }

  getStepPropertyInfo(key: string): string {
    if (key === 'JOpt.Algorithm.PreOptimization.SA.NumIterations') {
      return 'SA.NumIterations defines the number of iterations for simulated annealing. <strong>Note: This value is not adjustable as part of this demo application.</strong> ';
    }

    if (key === 'JOptExitCondition.JOptGenerationCount') {
      return 'After a certain number of generations JOpt terminates the genetic evolution phase. <strong>Note: This value is not adjustable as part of this demo application.</strong>';
    }

    if (key === 'JOptWeight.TimeWindow') {
      return 'JOpt weight for the timeWindow during the Optimization. A higher value results in a higher Optimization cost-penalty for violating a time window of a node.';
    }

    if (key === 'JOptWeight.RouteDistance') {
      return 'JOpt weight for RouteDistance during the Optimization. A higher value results in a higher Optimization cost-penalty for higher distances.';
    }

    if (key === 'JOptWeight.RouteTime') {
      return 'JOpt weight for RouteTime during the Optimization. A higher value results in a higher Optimization cost-penalty for routes that take more time.';
    }

    return '';
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
      data: {},
    });

    return dialogRef;
  }

  onStartClick(): void {
    this.dataService.setOptimizerSettings(this.settingsCopy);
    this.openRunDialog();
    this.prepareDialogRef.close();
  }

  onNoClick(): void {
    console.log('RunOptimizationDialogComponent closing without saving.');
    this.openSnackBar('Cancelling', 'Ok');
    this.prepareDialogRef.close();
  }
}
