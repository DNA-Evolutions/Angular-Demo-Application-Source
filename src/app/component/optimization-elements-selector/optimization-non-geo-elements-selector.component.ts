import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RestOptimization } from '@openapibuild/openapi';
import { Observable } from 'rxjs';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { OptimizationResultDialogComponent } from '../optimization-elements/result/optimization/optimization-result/opti-result-dialog.component';
import { NodePropertiesDialogComponent } from '../optimization-elements/node/node-properties-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-non-geo-elements-view',
    templateUrl: 'optimization-non-geo-elements-selector.component.html',
    styleUrls: ['optimization-non-geo-elements-selector.component.scss'],
})
export class OptimizationNonGeoElementsSelectorComponent implements OnInit {

    nodeIds: string[];

    selectedId: string;
    selectedNodeId: string;

    constructor(
        public dialog: MatDialog,
        public optiService: OptimizationWrapperService,
        private snackBar: MatSnackBar,
        public prepareDialogRef: MatDialogRef<
            OptimizationNonGeoElementsSelectorComponent
        >,
    ) {
    }

    public ngOnInit(): void {
        this.readElements();
    }

    /**
   *
   *
   * @private
   * @memberof OptimizationElementsSelectorComponent
   */
    private readElements(): void {
        this.nodeIds = this.optiService.getAllEventNodeIds();
    }


    public setSelectedId(id: string): void {

        if (this.nodeIds.indexOf(id) !== -1) {
            this.selectedNodeId = id;
            this.openNodeDialog(id);
        } else {
            this.selectedNodeId = undefined;
        }
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

        dialogRef.afterClosed().subscribe(() => { });
    }


    onNoClick(): void {
        this.openSnackBar('Cancelling', 'Ok');
        this.prepareDialogRef.close();
    }

    openSnackBar(message: string, action: string): void {
        this.snackBar.open(message, action, {
            duration: 1000,
        });
    }

}
