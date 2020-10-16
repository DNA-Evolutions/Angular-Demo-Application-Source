import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NodeDetailDialogData } from './node-dialog-data.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

import { InputOptimizationDataService } from '../../inputDataService/input-optimization-data.service';

import { JOptOpeningHours, JOptGeoNode, JOptRouteElementDetail, JOptGeoNodeVisitDuration } from 'build/openapi';


@Component({
  selector: 'app-node-detail-dialog',
  templateUrl: 'node-detail-dialog.component.html',
})
export class NodeDetailDialogComponent {

  //
  curNode: JOptGeoNode;

  // Copies
  openingHoursCopy: JOptOpeningHours[];

  // Copies
  visitDurationMinutes: number;

  // Result indicator
  hasResult?: boolean;

  constructor(
    private dataService: InputOptimizationDataService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<NodeDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NodeDetailDialogData) {

    this.curNode = this.dataService.node(data.nodeId);

    if (this.curNode === undefined) {
      this.openSnackBar('Node not found', 'Invalid');
      this.dialogRef.close();
    } else {
      // Create a deep copy of openingHours, so that user changes do not
      // directly reflect in the object without saving
      this.openingHoursCopy = JSON.parse(JSON.stringify(this.curNode.openingHours));

      this.visitDurationMinutes = this.dataService.durationMinutesByNode(this.curNode);

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
    console.log('NodeDetailDialogComponent closing with saving.');

    this.dataService.setNodeOpeningHour(this.data.nodeId, this.openingHoursCopy);

    this.dataService.setVisitDurationMinutes(this.data.nodeId, this.visitDurationMinutes);

    this.openSnackBar('Saved changes', 'Ok');

    this.dialogRef.close();
  }


  onNoClick(): void {
    console.log('NodeDetailDialogComponent closing without saving.');
    this.openSnackBar('Cancelling', 'Ok');
    this.dialogRef.close();
  }

}
