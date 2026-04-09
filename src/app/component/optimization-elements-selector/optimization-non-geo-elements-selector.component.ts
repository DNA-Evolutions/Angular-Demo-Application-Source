import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RestOptimization } from '@openapibuild/openapi';
import { Observable } from 'rxjs';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { OptimizationResultDialogComponent } from '../optimization-elements/result/optimization/optimization-result/opti-result-dialog.component';
import { NodePropertiesDialogComponent } from '../optimization-elements/node/node-properties-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EXTERNAL_LINKS } from 'src/app/_config/external-links';

/**
 * Component for selecting and editing non-geographic (event) nodes.
 *
 * @description Displays a list of event node IDs (nodes without a geographic location)
 * and opens the node properties dialog when one is selected. This component is typically
 * rendered inside a dialog and includes its own close/cancel behavior.
 *
 * @export
 * @class OptimizationNonGeoElementsSelectorComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-non-geo-elements-view',
    templateUrl: 'optimization-non-geo-elements-selector.component.html',
    styleUrls: ['optimization-non-geo-elements-selector.component.scss'],
    standalone: false
})
export class OptimizationNonGeoElementsSelectorComponent implements OnInit {

    readonly links = EXTERNAL_LINKS;

    /** List of all event (non-geographic) node IDs in the current optimization input. */
    nodeIds: string[];

    /** The currently selected element ID. */
    selectedId: string;

    /** The currently selected node ID, or undefined if no valid node is selected. */
    selectedNodeId: string;

    /**
     * Creates an instance of OptimizationNonGeoElementsSelectorComponent.
     *
     * @param {MatDialog} dialog - Angular Material dialog service for opening node property dialogs.
     * @param {OptimizationWrapperService} optiService - Service providing access to optimization data.
     * @param {MatSnackBar} snackBar - Snack bar for user notifications.
     * @param {MatDialogRef<OptimizationNonGeoElementsSelectorComponent>} prepareDialogRef - Reference to the parent dialog hosting this component.
     */
    constructor(
        public dialog: MatDialog,
        public optiService: OptimizationWrapperService,
        private snackBar: MatSnackBar,
        public prepareDialogRef: MatDialogRef<
            OptimizationNonGeoElementsSelectorComponent
        >,
    ) {
    }

    /**
     * Initializes the component by loading all event node IDs.
     */
    public ngOnInit(): void {
        this.readElements();
    }

    /**
     * Reads all event (non-geographic) node IDs from the optimization wrapper service.
     *
     * @private
     */
    private readElements(): void {
        this.nodeIds = this.optiService.getAllEventNodeIds();
    }


    /**
     * Sets the selected node ID and opens the properties dialog if the ID is valid.
     *
     * @description Checks whether the given ID exists in the event node list. If found,
     * immediately opens the node properties dialog for editing.
     *
     * @param {string} id - The node ID selected by the user.
     */
    public setSelectedId(id: string): void {

        if (this.nodeIds.indexOf(id) !== -1) {
            this.selectedNodeId = id;
            this.openNodeDialog(id);
        } else {
            this.selectedNodeId = undefined;
        }
    }


    /**
     * Opens the node properties dialog for the specified event node.
     *
     * @param {string} curNnodeId - The ID of the event node to display properties for.
     */
    public openNodeDialog(curNnodeId: string): void {
        const dialogRef = this.dialog.open(NodePropertiesDialogComponent, {
            maxWidth: '700px',
            width: '90%',
            data: { nodeId: curNnodeId },
        });

        dialogRef.afterClosed().subscribe(() => { });
    }


    /**
     * Handles the "Cancel" button click, closing the parent dialog.
     */
    onNoClick(): void {
        this.openSnackBar('Cancelling', 'Ok');
        this.prepareDialogRef.close();
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

}
