import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


import { JOptOpeningHours, JOptGeoNode, JOptConstraint, JOptBindingResourceConstraint, JOptExcludingResourceConstraint } from 'build/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { NodePropertiesData } from './interface/node-properties-data.interface';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { EmptyConstraint, EmptyBindingResourceConstraint, EmptyExcludingResourceConstraint, DummyConstraintResource } from './data/dummy-constraint';



@Component({
    selector: 'app-node-properties-dialog',
    templateUrl: 'node-properties-dialog.component.html',
})
export class NodePropertiesDialogComponent implements OnInit {

    openingHoursForm: FormGroup;

    //
    curNode: JOptGeoNode;

    // Copies
    openingHoursCopy: JOptOpeningHours[];

    // Copies
    visitDurationMinutes: number;

    // Copies
    constraintCopy: JOptConstraint;

    // Result indicator
    hasResult?: boolean;

    resourceIds: string[];

    constructor(
        private dataService: OptimizationWrapperService,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<NodePropertiesDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: NodePropertiesData) {

        // TODO move away logic from constructor? => ngOnInit
        this.curNode = this.dataService.node(data.nodeId);

        if (this.curNode === undefined) {
            this.openSnackBar('Node not found', 'Invalid');
            this.dialogRef.close();
        } else {
            // Create a deep copy of openingHours, so that user changes do not
            // directly reflect in the object without saving
            this.openingHoursCopy = JSON.parse(JSON.stringify(this.curNode.openingHours));

            //console.log(this.curNode.constraints);

            // Get all ids
            this.resourceIds = this.dataService.getAllResourceIds();

            this.setConstraint(this.curNode);

            this.visitDurationMinutes = this.dataService.durationMinutesByNode(this.curNode);

            const curResult = this.dataService.optimizationOutput();

            this.hasResult = curResult !== undefined;

        }
    }

    ngOnInit(): void {

    }

    private setConstraint(node: JOptGeoNode): void {

        if (node.constraints !== undefined) {

            this.constraintCopy = JSON.parse(JSON.stringify(node.constraints));

            // Fill up constraints
            if (this.constraintCopy.bindingResources === undefined) {
                this.constraintCopy.bindingResources = [];
            }

            if (this.constraintCopy.bindingResources.length === 0) {
                this.setEmptyBindingResource(this.constraintCopy);
            }

            if (this.constraintCopy.bindingResources[0].resources.length === 1) {
                this.addEmptyBindingConstraintResource(this.constraintCopy.bindingResources);
            }

            // Excluding

            if (this.constraintCopy.excludingResources === undefined) {
                this.constraintCopy.excludingResources = [];
            }

            if (this.constraintCopy.excludingResources.length === 0) {
                this.setEmptyExcludingResource(this.constraintCopy);
            }

            if (this.constraintCopy.excludingResources[0].resources.length === 1) {
                this.addEmptyExcludingConstraintResource(this.constraintCopy.excludingResources);
            }


        } else {

            // Create dummy constraints for representation purpose. Each user can
            // choose two binding and two excluding constraints

            // Build an empty constraint
            const myConstraint: JOptConstraint = JSON.parse(JSON.stringify(EmptyConstraint));

            this.setEmptyBindingResource(myConstraint);
            this.setEmptyExcludingResource(myConstraint);

            this.constraintCopy = myConstraint;

        }
    }

    private addEmptyBindingConstraintResource(cons: JOptBindingResourceConstraint[]): void {
        cons[0].resources[1] = JSON.parse(JSON.stringify(DummyConstraintResource));
    }

    private addEmptyExcludingConstraintResource(cons: JOptExcludingResourceConstraint[]): void {
        cons[0].resources[1] = JSON.parse(JSON.stringify(DummyConstraintResource));
    }

    private setEmptyBindingResource(con: JOptConstraint): void {
        con.bindingResources[0] = JSON.parse(JSON.stringify(EmptyBindingResourceConstraint));
        con.bindingResources[0].resources[0] = JSON.parse(JSON.stringify(DummyConstraintResource));
        con.bindingResources[0].resources[1] = JSON.parse(JSON.stringify(DummyConstraintResource));
    }

    private setEmptyExcludingResource(con: JOptConstraint): void {
        con.excludingResources[0] = JSON.parse(JSON.stringify(EmptyExcludingResourceConstraint));
        con.excludingResources[0].resources[0] = JSON.parse(JSON.stringify(DummyConstraintResource));
        con.excludingResources[0].resources[1] = JSON.parse(JSON.stringify(DummyConstraintResource));
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

        // Filter the constraints for empty tag "--"
        this.filterConstraint(this.constraintCopy);

        //console.log(this.constraintCopy);
        this.curNode.constraints = this.constraintCopy;
        console.log(this.curNode);

        this.openSnackBar('Saved changes', 'Ok');

        this.dialogRef.close();
    }

    private filterConstraint(con: JOptConstraint): void {

        //console.log('============== Filtering');
        //console.log(JSON.stringify(con));

        if (con.bindingResources[0].resources[0].id === '--' && con.bindingResources[0].resources[1].id === '--') {

            con.bindingResources = [];

        } else {
            if (con.bindingResources[0].resources[1].id === '--') {
                con.bindingResources[0].resources.splice(1, 1);
            }

            if (con.bindingResources[0].resources[0].id === '--') {
                con.bindingResources[0].resources.splice(0, 1);
            }

        }

        if (con.excludingResources[0].resources[0].id === '--' && con.excludingResources[0].resources[1].id === '--') {
            con.excludingResources = [];
        } else {

            if (con.excludingResources[0].resources[1].id === '--') {
                con.excludingResources[0].resources.splice(1, 1);
            }

            if (con.excludingResources[0].resources[0].id === '--') {
                con.excludingResources[0].resources.splice(0, 1);
            }
        }

        //console.log('============== After modification');
        //console.log(JSON.stringify(con));
        //console.log('============== Filtering Done');

    }



    onNoClick(): void {
        console.log('NodeDetailDialogComponent closing without saving.');
        this.openSnackBar('Cancelling', 'Ok');
        this.dialogRef.close();
    }

}
