import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PrepareRunOptimizationDialogData } from './prepare-run-optimization-data.interface';
import { RunOptimizationDialogComponent } from './run-optimization-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { OptimizationOptions } from '@openapibuild/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { Kv } from '../optimization-elements/result/optimization/interface/keyvalue/key-value.interface';
import { EXTERNAL_LINKS } from 'src/app/_config/external-links';

/**
 * Dialog component for preparing and configuring an optimization run.
 *
 * @description Presents the user with adjustable optimization settings (weights, iteration counts,
 * filters, etc.) before launching the actual optimization. Settings are displayed as sliders or
 * checkboxes depending on the property type. A deep copy of the current settings is made so that
 * modifications do not affect the live configuration until the user explicitly starts the run.
 *
 * @export
 * @class PrepareRunOptimizationDialogComponent
 */
@Component({
    selector: 'app-prepare-run-optimization-dialog',
    templateUrl: 'prepare-run-optimization-dialog.component.html',
    styleUrls: ['prepare-run-optimization-view.component.scss'],
    standalone: false
})
export class PrepareRunOptimizationDialogComponent {
  readonly links = EXTERNAL_LINKS;

  /** The current optimizer settings retrieved from the data service. */
  curSettings?: OptimizationOptions;

  /** Deep copy of the current settings, used to stage user modifications before saving. */
  settingsCopy!: OptimizationOptions;

  /** Flattened key-value representation of the settings properties, used for template binding. */
  settingsAsArray: Kv[];

  /**
   * Creates an instance of PrepareRunOptimizationDialogComponent.
   *
   * @description Loads the current optimization settings, converts them to an editable key-value
   * array, and creates a deep copy so that user changes are isolated until confirmed.
   *
   * @param {OptimizationWrapperService} dataService - Service providing access to optimization data and settings.
   * @param {MatSnackBar} snackBar - Angular Material snack bar for user notifications.
   * @param {MatDialogRef<PrepareRunOptimizationDialogComponent>} prepareDialogRef - Reference to this dialog instance.
   * @param {MatDialog} runDialog - Dialog service used to open the run-optimization dialog.
   * @param {PrepareRunOptimizationDialogData} data - Data injected into the dialog.
   */
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
    this.settingsAsArray = [];

    if (this.curSettings === undefined) {
      this.openSnackBar('Input is not valid', 'Invalid');
      this.prepareDialogRef.close();
      return;
    }

    let jsonObject = this.curSettings.properties;

    for (var value in jsonObject) {
      this.settingsAsArray.push({ key: value, value: jsonObject[value] });
    }

    // Create a deep copy of settings, so that user changes do not
    // directly reflect in the object without saving
    this.settingsCopy = JSON.parse(JSON.stringify(this.curSettings));
  }

  /**
   * Determines whether the slider for a given setting should be disabled.
   *
   * @description Certain properties (e.g., SA iteration count and generation count) are read-only
   * in this demo application and cannot be adjusted by the user.
   *
   * @param {string} key - The property key to check.
   * @returns {boolean} True if the slider should be disabled for this property.
   */
  public isDisabledSliderValue(key: string): boolean {
    if (key === 'JOpt.Algorithm.PreOptimization.SA.NumIterations') {
      return true;
    }

    if (key === 'JOptExitCondition.JOptGenerationCount') {
      return true;
    }

    return false;
  }

  /**
   * Returns the maximum allowed value for a given setting property slider.
   *
   * @param {string} key - The property key.
   * @returns {string} The maximum slider value as a string.
   */
  getMaxPropertyValue(key: string): string {
    if (key === 'JOpt.Algorithm.PreOptimization.SA.NumIterations') {
      return '500000';
    }

    if (key === 'JOptExitCondition.JOptGenerationCount') {
      return '10000';
    }

    return '100';
  }

  /**
   * Returns the step increment for a given setting property slider.
   *
   * @param {string} key - The property key.
   * @returns {string} The step increment value as a string.
   */
  getStepPropertyValue(key: string): string {
    if (key === 'JOpt.Algorithm.PreOptimization.SA.NumIterations') {
      return '10000';
    }

    if (key === 'JOptExitCondition.JOptGenerationCount') {
      return '1000';
    }

    return '1';
  }

  /**
   * Returns the input control type for a given setting property.
   *
   * @description Properties like 'JOpt.AutoFilter' are rendered as checkboxes;
   * all other properties default to sliders.
   *
   * @param {string} key - The property key.
   * @returns {string} Either 'checkbox' or 'slider'.
   */
  getPropertyType(key: string): string {
    if (key === 'JOpt.AutoFilter') {
      return 'checkbox';
    }
    return 'slider';
  }

  /**
   * Returns a shortened, human-readable abbreviation for a property key.
   *
   * @description Used for display labels in the settings UI so that long property
   * names do not clutter the interface.
   *
   * @param {string} key - The full property key.
   * @returns {string} An abbreviated label for the property.
   */
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

    if (key === 'JOpt.AutoFilter') {
      return 'AutoFilter';
    }

    return key;
  }

  /**
   * Returns an HTML-formatted informational tooltip or description for a property.
   *
   * @description Provides contextual help text explaining what each optimization
   * property controls and how changing it affects the optimization behavior.
   *
   * @param {string} key - The property key.
   * @returns {string} An HTML string with a description of the property, or empty string if unknown.
   */
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

    if (key === 'JOpt.AutoFilter') {
      return 'Turns on or off the AutoFilter. The AutoFilter is able to remove nodes that are violating the optimization too often.';
    }

    return '';
  }

  /**
   * Displays a brief snack bar notification to the user.
   *
   * @param {string} message - The message text to display.
   * @param {string} action - The label for the snack bar action button.
   */
  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 1000,
    });
  }

  /**
   * Opens the run-optimization dialog that actually triggers and monitors the optimization.
   *
   * @returns {MatDialogRef<RunOptimizationDialogComponent>} A reference to the opened dialog.
   */
  openRunDialog(): MatDialogRef<RunOptimizationDialogComponent> {
    const dialogRef = this.runDialog.open(RunOptimizationDialogComponent, {
      minWidth: '40vw',
      maxWidth: '95vw',
      maxHeight: '85vh',
      disableClose: true,
      data: {},
    });

    return dialogRef;
  }

  /**
   * Handles the "Start" button click.
   *
   * @description Applies the user-modified settings back to the optimizer configuration,
   * opens the run dialog to begin the optimization, and closes the current prepare dialog.
   */
  onStartClick(): void {

    this.settingsAsArray.forEach((entry: Kv) => {
      this.settingsCopy.properties[entry.key] = entry.value;
    });

    this.dataService.setOptimizerSettings(this.settingsCopy);
    this.openRunDialog();
    this.prepareDialogRef.close();
  }

  /**
   * Handles the "Cancel" button click.
   *
   * @description Discards any changes made in the dialog and closes it.
   */
  onNoClick(): void {
    //console.log('RunOptimizationDialogComponent closing without saving.');
    this.openSnackBar('Cancelling', 'Ok');
    this.prepareDialogRef.close();
  }
}
