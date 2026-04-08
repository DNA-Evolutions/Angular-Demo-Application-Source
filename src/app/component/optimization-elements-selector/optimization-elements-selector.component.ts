import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NodePropertiesDialogComponent } from '../optimization-elements/node/node-properties-dialog.component';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { ResourcePropertiesDialogComponent } from '../optimization-elements/resource/resource-properties-dialog.component';

/**
 * Component that provides a dropdown or list for selecting optimization elements (Nodes and Resources).
 *
 * @description Displays all available node and resource IDs and allows the user to select one.
 * When a node or resource is selected, the corresponding properties dialog is opened.
 * The element lists are automatically refreshed when the data service signals a change
 * (e.g., after an optimization run or manual edit).
 *
 * @export
 * @class OptimizationElementsSelectorComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-optimization-elements-selector',
    templateUrl: 'optimization-elements-selector.component.html',
    styleUrls: ['./optimization-elements-selector.component.scss'],
    standalone: false
})
export class OptimizationElementsSelectorComponent implements OnInit {
  /** List of all node IDs in the current optimization input. */
  nodeIds: string[];

  /** List of all resource IDs in the current optimization input. */
  resourceIds: string[];

  /** The currently selected element ID (either a node or resource). */
  selectedId: string;

  /** The currently selected node ID, or undefined if a resource is selected. */
  selectedNodeId: string;

  /** The currently selected resource ID, or undefined if a node is selected. */
  selectedResourceId: string;

  /**
   * Creates an instance of OptimizationElementsSelectorComponent.
   * @param {MatDialog} dialog
   * @param {OptimizationWrapperService} optiService
   * @memberof OptimizationElementsSelectorComponent
   */
  constructor(
    public dialog: MatDialog,
    public optiService: OptimizationWrapperService
  ) {}

  /**
   * Sets the selected element ID and determines whether it is a node or resource.
   *
   * @description Checks the ID against the known resource and node ID lists to populate
   * the appropriate selectedNodeId or selectedResourceId, clearing the other.
   *
   * @param {string} id - The element ID selected by the user.
   */
  public setSelectedId(id: string): void {
    if (this.resourceIds.indexOf(id) !== -1) {
      this.selectedResourceId = id;
    } else {
      this.selectedResourceId = undefined;
    }

    if (this.nodeIds.indexOf(id) !== -1) {
      this.selectedNodeId = id;
    } else {
      this.selectedNodeId = undefined;
    }
  }

  /**
   * Initializes the component by loading all element IDs and subscribing to refresh events.
   *
   * @description Reads the initial node and resource IDs, then subscribes to the refresh
   * observable so that the lists are reloaded whenever the optimization data changes.
   */
  public ngOnInit(): void {
    // Get all ids
    this.readElements();

    this.optiService.getRefreshObservable().subscribe((result: boolean) => {
      if (result) {
        this.readElements();
      }
    });
  }

  /**
   * Reads the current node and resource IDs from the optimization wrapper service.
   *
   * @private
   */
  private readElements(): void {
    this.nodeIds = this.optiService.getAllNodeIds();
    this.resourceIds = this.optiService.getAllResourceIds();
  }

  /**
   * Opens the node properties dialog for the specified node.
   *
   * @param {string} curNnodeId - The ID of the node to display properties for.
   */
  public openNodeDialog(curNnodeId: string): void {
    const dialogRef = this.dialog.open(NodePropertiesDialogComponent, {
      maxWidth: '700px',
      width: '90%',
      data: { nodeId: curNnodeId },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  /**
   * Opens the resource properties dialog for the specified resource.
   *
   * @param {string} curResId - The ID of the resource to display properties for.
   */
  public openResourceDialog(curResId: string): void {
    const dialogRef = this.dialog.open(ResourcePropertiesDialogComponent, {
      maxWidth: '700px',
      width: '90%',
      data: { resId: curResId },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
}
