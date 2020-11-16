import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(NodePropertiesDialogComponent, {
      maxWidth: '700px',
      width: '90%',
      data: { nodeId: this.nodeId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //
    });
  }
}
