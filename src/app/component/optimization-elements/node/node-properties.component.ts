import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NodePropertiesDialogComponent } from './node-properties-dialog.component';


/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-node-properties',
  templateUrl: 'node-properties.component.html',
})
export class NodePropertiesComponent {

  nodeId: string;

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(NodePropertiesDialogComponent, {
      width: '550px',
      data: { nodeId: this.nodeId }
    });

    dialogRef.afterClosed().subscribe(result => {

    console.log('NodeDetailMarkerViewComponent was closed: ' + result);

    });
  }

}
