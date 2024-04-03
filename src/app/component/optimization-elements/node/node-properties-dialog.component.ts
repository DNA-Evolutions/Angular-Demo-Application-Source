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

  enabledSaveTooltip = "Save all modifications and close this dialog.";
  disabledSaveTooltip = "Please correct the errors before saving. For example, the start lies after the end. Or different days are overlapping.";

  isPillar: boolean = false;

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

    this.curNode.type = this.typeCopy;


    // XXX - Maybe use this code later to transform nodes => evens and vice versa
    //this.testTranform2Event();

    
    // To update the map view, we have to trigger a new map refresh
    (this.dataService.getRefreshObservable() as ReplaySubject<boolean>).next(true);

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





  /*
  /
  / Pillar
  /
  */

   // This method should be called whenever curNode changes
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

  // Responds to checkbox changes
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

          // Potential flags

          /*attachedResourceId: "Jack from Koeln",
          /onlyScheduledInCompany: false,
					/isOverwritingRouteTermination: false,
					/isSchedulableBeforeWorkingHours: false,
					/isSchedulableAfterWorkingHours: false,
					/isTimeAdjustableAnchor: false*/

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
   *
   *
   * @memberof NodePropertiesDialogComponent
   */
  onNoClick(): void {
    this.openSnackBar('Cancelling', 'Ok');
    this.dialogRef.close();
  }
}
