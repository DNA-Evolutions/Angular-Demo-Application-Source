import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


import { JOptOpeningHours, JOptGeoResource, JOptWorkingHours, JOptGeoResourceMaxDistance, JOptGeoResourceMaxTime } from 'build/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { ResourcePropertiesData } from './interface/resource-properties-data.interface';


@Component({
    selector: 'app-resource-properties-dialog',
    templateUrl: 'resource-properties-dialog.component.html',
})
export class ResourcePropertiesDialogComponent {

    //
    curRes: JOptGeoResource;

    // Copies
    workingHoursCopy: JOptWorkingHours[];

    maxDistanceCopy: JOptGeoResourceMaxDistance;

    maxTimeCopy: JOptGeoResourceMaxTime;
    maxTimeHours: number;


    // Result indicator
    hasResult?: boolean;

    constructor(
        private dataService: OptimizationWrapperService,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<ResourcePropertiesDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ResourcePropertiesData) {

        this.curRes = this.dataService.resource(data.resId);

        if (this.curRes === undefined) {
            this.openSnackBar('Resource not found', 'Invalid');
            this.dialogRef.close();
        } else {
            // Create a deep copy of openingHours, so that user changes do not
            // directly reflect in the object without saving
            this.workingHoursCopy = JSON.parse(JSON.stringify(this.curRes.workingHours));
            this.maxDistanceCopy = JSON.parse(JSON.stringify(this.curRes.maxDistance));


            this.maxTimeCopy = JSON.parse(JSON.stringify(this.curRes.maxTime));

            this.maxTimeHours = this.dataService.maxWorkingTimeHoursByResource(this.curRes);

            const curResult = this.dataService.optimizationOutput();

            this.hasResult = curResult !== undefined;

        }
    }

    openSnackBar(message: string, action: string): void {
        this.snackBar.open(message, action, {
            duration: 1000,
        });
    }


    onSaveClick(): void {

        this.dataService.setResourceWorkingHour(this.data.resId, this.workingHoursCopy);
        //this.curRes.maxTime = <JOptGeoResourceMaxTime>(this.maxTimeHours * 3600);
        this.dataService.setMaxWokringTimeHours(this.curRes.id, this.maxTimeHours);

        this.openSnackBar('Saved changes', 'Ok');

        this.dialogRef.close();
    }


    onNoClick(): void {

        this.openSnackBar('Cancelling', 'Ok');
        this.dialogRef.close();
    }


}
