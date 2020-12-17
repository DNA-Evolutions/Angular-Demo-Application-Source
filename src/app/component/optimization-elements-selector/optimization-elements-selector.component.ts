import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NodePropertiesDialogComponent } from '../optimization-elements/node/node-properties-dialog.component';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { ResourcePropertiesDialogComponent } from '../optimization-elements/resource/resource-properties-dialog.component';

/**
 *
 * Component to select an element (Node or Resource) to show properties for
 *
 * @export
 * @class OptimizationElementsSelectorComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-optimization-elements-selector',
  templateUrl: 'optimization-elements-selector.component.html',
  styleUrls: ['./optimization-elements-selector.component.scss'],
})
export class OptimizationElementsSelectorComponent implements OnInit {
  nodeIds: string[];
  resourceIds: string[];

  selectedId: string;
  selectedNodeId: string;
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
   *
   *
   * @param {string} id
   * @memberof OptimizationElementsSelectorComponent
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
   *
   *
   * @memberof OptimizationElementsSelectorComponent
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
   *
   *
   * @private
   * @memberof OptimizationElementsSelectorComponent
   */
  private readElements(): void {
    this.nodeIds = this.optiService.getAllNodeIds();
    this.resourceIds = this.optiService.getAllResourceIds();
  }

  /**
   *
   *
   * @param {string} curNnodeId
   * @memberof OptimizationElementsSelectorComponent
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
   *
   *
   * @param {string} curResId
   * @memberof OptimizationElementsSelectorComponent
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
