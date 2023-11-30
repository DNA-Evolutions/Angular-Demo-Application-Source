import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  OpeningHours,
  Node,
  Constraint,
  BindingResourceConstraint,
  ExcludingResourceConstraint,
} from 'build/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';

import { NodePropertiesData } from './interface/node-properties-data.interface';
import { FormGroup } from '@angular/forms';
import {
  EmptyBindingResourceConstraint,
  EmptyExcludingResourceConstraint,
} from './data/dummy-constraint';

/**
 * The Component to show/modify node properties.
 *
 * @export
 * @class NodePropertiesDialogComponent
 *
 */
@Component({
  selector: 'app-node-properties-dialog',
  templateUrl: 'node-properties-dialog.component.html',
})
export class NodePropertiesDialogComponent {
  openingHoursForm: FormGroup;

  //
  curNode: Node;

  // Copies
  openingHoursCopy: OpeningHours[];

  // Copies
  visitDurationMinutes: number;

  // Copies
  constraintsCopy: Constraint[];

  binding: Constraint[] = [];
  excluding: Constraint[] = [];

  // Result indicator
  hasResult?: boolean;

  resourceIds: string[];

  /**
   * Creates an instance of NodePropertiesDialogComponent.
   * @param {OptimizationWrapperService} dataService
   * @param {MatSnackBar} snackBar
   * @param {MatDialogRef<NodePropertiesDialogComponent>} dialogRef
   * @param {NodePropertiesData} data
   * @memberof NodePropertiesDialogComponent
   */
  constructor(
    private dataService: OptimizationWrapperService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<NodePropertiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NodePropertiesData
  ) {
    // TODO move away logic from constructor? => ngOnInit
    this.curNode = this.dataService.node(data.nodeId);

    if (this.curNode === undefined) {
      this.openSnackBar('Node not found', 'Invalid');
      this.dialogRef.close();
    } else {
      // Create a deep copy of openingHours, so that user changes do not
      // directly reflect in the object without saving
      this.openingHoursCopy = JSON.parse(
        JSON.stringify(this.curNode.openingHours)
      );

      // Get all ids
      this.resourceIds = this.dataService.getAllResourceIds();

      this.setConstraint(this.curNode);

      this.visitDurationMinutes = this.dataService.durationMinutesByNode(
        this.curNode
      );

      const curResult = this.dataService.optimizationOutput();

      this.hasResult = curResult !== undefined;
    }
  }

  /**
   *
   *
   * @private
   * @param {Node} node
   * @memberof NodePropertiesDialogComponent
   */
  private setConstraint(node: Node): void {
    let myBindingResoure: Constraint;
    let myExclduingResoure: Constraint;
    let modifiedConstraints: Constraint[] = [];

    if (node.constraints !== undefined) {
      this.constraintsCopy = JSON.parse(JSON.stringify(node.constraints));

      console.log(this.constraintsCopy);

      for (let c of this.constraintsCopy) {
        if (c.type.typeName === "BindingResource") {
          console.log('found BindingResourceConstraint');
          if (myBindingResoure === undefined) {
            myBindingResoure = c;
          }
        }

        if (c.type.typeName === "ExcludingResource") {
          console.log('found ExcludingResourceConstraint');
          if (myExclduingResoure === undefined) {
            myExclduingResoure = c;
          }
        }
      }
    }

    // Fill up constraints
    if (myBindingResoure === undefined) {
      myBindingResoure = JSON.parse(
        JSON.stringify(EmptyBindingResourceConstraint)
      );
    }

    if (myExclduingResoure === undefined) {
      myExclduingResoure = JSON.parse(
        JSON.stringify(EmptyExcludingResourceConstraint)
      );
    }

    modifiedConstraints.push(myBindingResoure);
    this.binding.push(myBindingResoure);

    modifiedConstraints.push(myExclduingResoure);
    this.excluding.push(myExclduingResoure);

    this.constraintsCopy = modifiedConstraints;
  }

  asBindingResourceType(c: Constraint): BindingResourceConstraint {
    return c.type as BindingResourceConstraint;
  }

  asExcludingResourceType(c: Constraint): ExcludingResourceConstraint {
    return c.type as ExcludingResourceConstraint;
  }

  /**
   *
   *
   * @param {string} message
   * @param {string} action
   * @memberof NodePropertiesDialogComponent
   */
  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 1000,
    });
  }

  /**
   *
   *
   * @memberof NodePropertiesDialogComponent
   */
  onSaveClick(): void {
    this.dataService.setNodeOpeningHour(
      this.data.nodeId,
      this.openingHoursCopy
    );

    this.dataService.setVisitDurationMinutes(
      this.data.nodeId,
      this.visitDurationMinutes
    );

    // Filter the constraints for empty tag "--"
    const fitlererdConstraint = this.filterConstraints(this.constraintsCopy);

    this.curNode.constraints = fitlererdConstraint;

    this.openSnackBar('Saved changes', 'Ok');

    this.dialogRef.close();
  }

  /**
   *
   *
   * @private
   * @param {Constraint[]} cons
   * @memberof NodePropertiesDialogComponent
   */
  private filterConstraints(cons: Constraint[]): Constraint[] {
    const fitlererdConstraint = cons.filter(c => {
      // Binding
      if (c.type.typeName === "BindingResource") {
        let curRess = (c.type as BindingResourceConstraint).resources;

        if (curRess.length === 0) {
          return !true;
        }

        if (curRess.length > 0) {
          return curRess[0].resourceId !== '--';
        }
      }

      // Exclduing
      if (c.type.typeName === "ExcludingResource") {
        let curRess = (c.type as ExcludingResourceConstraint).resources;

        if (curRess.length === 0) {
          return !true;
        }

        if (curRess.length > 0) {
          return curRess[0].resourceId !== '--';
        }
      }

      // Filter unknow constraints
      return !true;
    });

    return fitlererdConstraint;
  }

  /**
   *
   *
   * @memberof NodePropertiesDialogComponent
   */
  onNoClick(): void {
    this.openSnackBar('Cancelling', 'Ok');
    this.dialogRef.close();
  }
}
