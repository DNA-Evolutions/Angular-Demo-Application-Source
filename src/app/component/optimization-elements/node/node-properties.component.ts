import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NodePropertiesDialogComponent } from './node-properties-dialog.component';

/**
 * Component to open node properties dialog
 *
 * @export
 * @class NodePropertiesComponent
 */
@Component({
    selector: 'app-node-properties',
    templateUrl: 'node-properties.component.html',
    standalone: false
})
export class NodePropertiesComponent {
  nodeId: string;


  /**
   * Creates an instance of NodePropertiesComponent.
   * @param {MatDialog} dialog
   * @memberof NodePropertiesComponent
   */
  constructor(public dialog: MatDialog) {}


  /**
   *
   *
   * @memberof NodePropertiesComponent
   */
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
