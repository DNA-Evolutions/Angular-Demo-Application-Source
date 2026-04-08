import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  Resource,
  WorkingHours,
} from '@openapibuild/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { ResourcePropertiesData } from './interface/resource-properties-data.interface';

/**
 * Dialog component for viewing and editing the properties of a single optimization resource.
 *
 * @description Allows the user to modify a resource's working hours, maximum working time,
 * and maximum travel distance. All editable fields are deep-copied on open so that changes
 * are only persisted when the user explicitly saves.
 *
 * @export
 * @class ResourcePropertiesDialogComponent
 */
@Component({
    selector: 'app-resource-properties-dialog',
    templateUrl: 'resource-properties-dialog.component.html',
    standalone: false
})
export class ResourcePropertiesDialogComponent {
  /** Reference to the current resource being edited, retrieved from the data service. */
  curRes: Resource;

  /** Deep copy of the resource's working hours, isolating edits until save. */
  workingHoursCopy: WorkingHours[];

  /** Deep copy of the resource's maximum distance as a raw string (from the API model). */
  maxDistanceCopy: String;

  /** Deep copy of the resource's maximum time as a raw string (from the API model). */
  maxTimeCopy: String;

  /** Editable maximum working time value in hours, derived from maxTimeCopy. */
  maxTimeHours: number;

  /** Editable maximum travel distance value in kilometers, derived from maxDistanceCopy. */
  maxDistanceKm: number;

  /** Indicates whether an optimization result currently exists. */
  hasResult?: boolean;

  /** Tooltip text shown when the save button is enabled. */
  enabledSaveTooltip = "Save all modifications and close this dialog.";

  /** Tooltip text shown when the save button is disabled due to validation errors. */
  disabledSaveTooltip = "Please correct the errors before saving. For example, the start lies after the end. Or different days are overlapping.";

  /**
   * Creates an instance of ResourcePropertiesDialogComponent.
   *
   * @description Loads the resource by ID from the data service, creates deep copies of all
   * editable properties, and checks whether an optimization result exists.
   *
   * @param {OptimizationWrapperService} dataService - Service providing access to optimization data.
   * @param {MatSnackBar} snackBar - Angular Material snack bar for user notifications.
   * @param {MatDialogRef<ResourcePropertiesDialogComponent>} dialogRef - Reference to this dialog.
   * @param {ResourcePropertiesData} data - Data injected into this dialog, containing the resource ID.
   */
  constructor(
    private dataService: OptimizationWrapperService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ResourcePropertiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResourcePropertiesData
  ) {
    this.curRes = this.dataService.resource(data.resId);

    if (this.curRes === undefined) {
      this.openSnackBar('Resource not found', 'Invalid');
      this.dialogRef.close();
    } else {
      // Create a deep copy of openingHours, so that user changes do not
      // directly reflect in the object without saving
      this.workingHoursCopy = JSON.parse(
        JSON.stringify(this.curRes.workingHours)
      );

      this.maxDistanceCopy = JSON.parse(
        JSON.stringify(this.curRes.maxDistance)
      );

      this.maxTimeCopy = JSON.parse(JSON.stringify(this.curRes.maxTime));

      this.maxTimeHours = this.dataService.maxWorkingTimeHoursByResource(
        this.curRes
      );

      this.maxDistanceKm = this.dataService.maxDistanceKmByResource(
        this.curRes
      );

      const curResult = this.dataService.optimizationOutput();

      this.hasResult = curResult !== undefined;
    }
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
   * Handles the "Save" button click.
   *
   * @description Persists the modified working hours, maximum working time, and maximum
   * travel distance back to the data service, then closes the dialog.
   */
  onSaveClick(): void {
    this.dataService.setResourceWorkingHour(
      this.data.resId,
      this.workingHoursCopy
    );
    //this.curRes.maxTime = <JOptGeoResourceMaxTime>(this.maxTimeHours * 3600);
    this.dataService.setMaxWokringTimeHours(this.curRes.id, this.maxTimeHours);
    this.dataService.setMaxDistanceKm(this.curRes.id, this.maxDistanceKm);

    this.openSnackBar('Saved changes', 'Ok');

    this.dialogRef.close();
  }

  /**
   * Handles the "Cancel" button click.
   *
   * @description Discards all unsaved changes and closes the dialog.
   */
  onNoClick(): void {
    this.openSnackBar('Cancelling', 'Ok');
    this.dialogRef.close();
  }
}
