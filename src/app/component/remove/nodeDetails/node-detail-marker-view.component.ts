import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NodeDetailDialogComponent } from './node-detail-dialog.component';


/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-node-detail-maker-view',
  templateUrl: 'node-detail-marker-view.component.html',
})
export class NodeDetailMarkerViewComponent {

  nodeId: string;

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(NodeDetailDialogComponent, {
      width: '550px',
      data: { nodeId: this.nodeId }
    });

    dialogRef.afterClosed().subscribe(result => {

    console.log('NodeDetailMarkerViewComponent was closed: ' + result);

    });
  }

}
