import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NodePropertiesDialogComponent } from './node-properties-dialog.component';

/**
 * Trigger component that opens the node properties dialog.
 *
 * @description Provides a clickable UI element (typically a button or link) that, when activated,
 * opens the {@link NodePropertiesDialogComponent} in a Material dialog. This component acts as
 * a lightweight wrapper whose sole responsibility is dialog lifecycle management.
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
  /** The identifier of the node whose properties should be displayed. */
  nodeId: string;


  /**
   * Creates an instance of NodePropertiesComponent.
   * @param {MatDialog} dialog
   * @memberof NodePropertiesComponent
   */
  constructor(public dialog: MatDialog) {}


  /**
   * Opens the node properties dialog for the current nodeId.
   *
   * @description Launches a Material dialog containing the {@link NodePropertiesDialogComponent},
   * passing the current nodeId as dialog data. The dialog has a max width of 700px and
   * occupies 90% of the viewport width.
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
