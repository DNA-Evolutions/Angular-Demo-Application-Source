import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  NodeType,
  GeoPillarNode,
  GeoNode,
  EventNode,
  OpeningHours,
  Node,
  Constraint,
  BindingResourceConstraint,
  ExcludingResourceConstraint,
} from '@openapibuild/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';

import { NodePropertiesData } from './interface/node-properties-data.interface';
import { FormGroup } from '@angular/forms';
import {
  EmptyBindingResourceConstraint,
  EmptyExcludingResourceConstraint,
} from './data/dummy-constraint';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

/**
 * Dialog component for viewing and editing the properties of a single optimization node.
 *
 * @description Allows the user to modify a node's opening hours, visit duration, pillar status,
 * and resource constraints (binding and excluding). All editable fields are deep-copied on open
 * so that changes are only persisted when the user explicitly saves. On save, the modified
 * properties are written back to the data service and a map refresh is triggered.
 *
 * @export
 * @class NodePropertiesDialogComponent
 */
@Component({
    selector: 'app-node-properties-dialog',
    templateUrl: 'node-properties-dialog.component.html',
    standalone: false
})
export class NodePropertiesDialogComponent {
  /** Reactive form group for opening hours validation. */
  openingHoursForm: FormGroup;

  /** Reference to the current node being edited, retrieved from the data service. */
  curNode: Node;

  /** Deep copy of the node's opening hours, isolating edits until save. */
  openingHoursCopy: OpeningHours[];

  /** Deep copy of the node's visit duration in minutes for editing. */
  visitDurationMinutes: number;

  /** Deep copy of the node's constraints for editing. */
  constraintsCopy: Constraint[];

  /** Array holding the binding resource constraint(s) for this node. */
  binding: Constraint[] = [];

  /** Array holding the excluding resource constraint(s) for this node. */
  excluding: Constraint[] = [];

  /** Indicates whether an optimization result currently exists. */
  hasResult?: boolean;

  /** List of all resource IDs available in the current optimization, used for constraint dropdowns. */
  resourceIds: string[];

  /** Tooltip text shown when the save button is enabled. */
  enabledSaveTooltip = "Save all modifications and close this dialog.";

  /** Tooltip text shown when the save button is disabled due to validation errors. */
  disabledSaveTooltip = "Please correct the errors before saving. For example, the start lies after the end. Or different days are overlapping.";

  /** Whether the current node is flagged as a pillar node (must-visit, fixed-position node). */
  isPillar: boolean = false;

  /** Deep copy of the node's type definition, supporting in-dialog type modifications. */
  typeCopy: NodeType;

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

      this.updateIsPillarFlag();

      this.typeCopy = JSON.parse(
        JSON.stringify(this.curNode.type)
      );

      

      const curResult = this.dataService.optimizationOutput();

      this.hasResult = curResult !== undefined;

    }
  }

  /**
   * Extracts and initializes the binding and excluding resource constraints from a node.
   *
   * @description Deep-copies the node's constraints and separates them into binding and
   * excluding categories. If a constraint type is not present, a default empty constraint
   * is created as a placeholder for the user to populate.
   *
   * @private
   * @param {Node} node - The node whose constraints should be loaded.
   */
  private setConstraint(node: Node): void {
    let myBindingResoure: Constraint;
    let myExclduingResoure: Constraint;
    let modifiedConstraints: Constraint[] = [];

    if (node.constraints !== undefined) {
      this.constraintsCopy = JSON.parse(JSON.stringify(node.constraints));

      //console.log(this.constraintsCopy);

      for (let c of this.constraintsCopy) {
        if (c.type.typeName === "BindingResource") {
          //console.log('found BindingResourceConstraint');
          if (myBindingResoure === undefined) {
            myBindingResoure = c;
          }
        }

        if (c.type.typeName === "ExcludingResource") {
          //console.log('found ExcludingResourceConstraint');
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

  /**
   * Casts a generic constraint's type to a {@link BindingResourceConstraint}.
   *
   * @param {Constraint} c - The constraint to cast.
   * @returns {BindingResourceConstraint} The constraint type narrowed to BindingResourceConstraint.
   */
  asBindingResourceType(c: Constraint): BindingResourceConstraint {
    return c.type as BindingResourceConstraint;
  }

  /**
   * Casts a generic constraint's type to an {@link ExcludingResourceConstraint}.
   *
   * @param {Constraint} c - The constraint to cast.
   * @returns {ExcludingResourceConstraint} The constraint type narrowed to ExcludingResourceConstraint.
   */
  asExcludingResourceType(c: Constraint): ExcludingResourceConstraint {
    return c.type as ExcludingResourceConstraint;
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

  /**
   * Handles the "Save" button click.
   *
   * @description Persists all user modifications (opening hours, visit duration, constraints,
   * node type, and pillar status) back to the data service. Triggers a map refresh so that
   * visual representations are updated, then closes the dialog.
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

    this.curNode.type = this.typeCopy;


    // XXX - Maybe use this code later to transform nodes => evens and vice versa
    //this.testTranform2Event();

    
    // To update the map view, we have to trigger a new map refresh
    (this.dataService.getRefreshObservable() as ReplaySubject<boolean>).next(true);

    this.openSnackBar('Saved changes', 'Ok');

    this.dialogRef.close();
  }

  /**
   * Filters out constraints that have placeholder/empty resource bindings.
   *
   * @description Removes binding and excluding constraints whose first resource ID is
   * the placeholder value '--', indicating the user did not assign a real resource.
   * Also filters out any unknown constraint types.
   *
   * @private
   * @param {Constraint[]} cons - The array of constraints to filter.
   * @returns {Constraint[]} A new array containing only valid, non-placeholder constraints.
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





  /*
  /
  / Pillar
  /
  */

  /**
   * Updates the isPillar flag based on the current node's type.
   *
   * @description Checks if the node is a GeoNode or EventNode and reads the pillarNode
   * property to determine pillar status. Should be called whenever the current node changes.
   */
   updateIsPillarFlag() {

    // Cast node.type to GeoNode or Event
    if (this.curNode.type.typeName === 'Geo') {
      const geoNodeType = this.curNode?.type as GeoNode;
      this.isPillar = !!geoNodeType?.pillarNode;
    }

    if (this.curNode.type.typeName === 'Event') {
      const eventNodeType = this.curNode?.type as EventNode;
      this.isPillar = !!eventNodeType?.pillarNode;
    }

   
  }

  /**
   * Toggles the pillar node status in response to a checkbox change.
   *
   * @description When enabled, creates a minimal {@link GeoPillarNode} and assigns it to the
   * node type's pillarNode property. When disabled, removes the pillarNode property entirely.
   *
   * @param {boolean} value - True to mark the node as a pillar, false to remove pillar status.
   */
  togglePillar(value: boolean) {

    let type = this.typeCopy; // or this.curNode.type

    // Ensure curNode.type is treated as GeoNode
    if (!type) {
      // If type is not defined, define it with an empty GeoNode
      type = {} as GeoNode;
    }
    const geoNodeType = type as GeoNode;



    if (value) {
      // If checkbox is checked and pillarNode doesn't exist, create it
      if (!geoNodeType.pillarNode) {
        // Initialize pillarNode here. Adjust the initialization as necessary.
        console.log("Creating a pillar node")

        const minimalGeoPillarNode: GeoPillarNode = {
          typeName: 'GeoPillarNode'
        };

        geoNodeType.pillarNode = minimalGeoPillarNode;
      }
    } else {
      // If checkbox is unchecked, remove or empty pillarNode
      delete geoNodeType.pillarNode; // or geoNodeType.pillarNode = undefined;
    }

    // After modification, you might need to update the state of curNode
    // in your application state if it's being managed centrally
  }


  // XXX
  private testTranform2Event(){

    //
    const eventType : EventNode = {typeName:"Event"};



    this.curNode.type = eventType

    //this.curNode.type.typeName = "Event"


    console.log(JSON.stringify(this.curNode))
  }

  public testTranform2Pillar(){

  }


/*
  public isGeoPillar(node: Node): boolean{
    
    if (node !== undefined) {
      let geoNode = node.type as GeoNode
      if(geoNode.pillarNode){
        return true;
      }
    }

    return false;
  }

  private transformToGeoPillar(node: Node){

    if (node !== undefined) {

      let geoNode = node.type as GeoNode

      if(geoNode.pillarNode){
        console.log()
      }
      

    }

    if(node.type as GeoNode){

    }

    if (node.type.typeName === "Geo") {

    }
    
    if (node.type.typeName === "Geo") {
      
    }

    console.log(node.type.typeName)
      
  }*/



  /**
   * Handles the "Cancel" button click.
   *
   * @description Discards all unsaved changes and closes the dialog.
   */
  onNoClick(): void {
    this.openSnackBar('Cancelling', 'Ok');
    this.dialogRef.close();
  }
}
