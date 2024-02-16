import { Component, Input, OnInit, Inject } from '@angular/core';

import { RouteElementDetail, Route } from '@openapibuild/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * Component to show the route results
 *
 * @export
 * @class RouteResultDialogComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-route-result-dialog',
  templateUrl: 'route-result-dialog.component.html',
  styleUrls: ['./route-result-dialog.component.scss'],
})
export class RouteResultDialogComponent implements OnInit {
  /**
   * Use a route id as input to extract its route result from an optimizaion result
   *
   * @type {number}
   * @memberof RouteResultDialogComponent
   */
  @Input() routeId: number;

  /**
   * Use a route object as input to extract its route result from an optimizaion result
   *
   * @type {JOptRoute}
   * @memberof RouteResultDialogComponent
   */
  @Input() route: Route;

  /**
   *
   * The current route object we need the result for
   *
   * @type {JOptRoute}
   * @memberof RouteResultDialogComponent
   */
  curRoute?: Route;

  expandedElement: RouteElementDetail | null;

  public panelOpenState: boolean;

  // During next and prev in nodes
  step = -1;

  /**
   * Creates an instance of RouteResultDialogComponent.
   * @param {OptimizationWrapperService} dataService
   * @param {*} data
   * @param {MatDialogRef<RouteResultDialogComponent>} dialogRef
   * @memberof RouteResultDialogComponent
   */
  constructor(
    private dataService: OptimizationWrapperService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RouteResultDialogComponent>
  ) {}

  /**
   *
   *
   * @private
   * @return {*}  {void}
   * @memberof RouteResultDialogComponent
   */
  private extractRoute(): void {
    if (this.route !== undefined) {
      this.curRoute = this.route;
      return;
    }

    let curRouteId: number;

    if (this.routeId !== undefined) {
      curRouteId = this.routeId;
    } else {
      curRouteId = this.data.routeId;
    }

    if (curRouteId !== undefined) {
      const curResult = this.dataService.optimizationOutput();

      if (curResult !== undefined) {
        //Found existing result

        this.curRoute = OptimizationWrapperService.routeResult(
          this.data.routeId,
          curResult
        );
      }
    }

    if (this.curRoute === undefined) {
      this.curRoute = this.data.route;
    }
  }

  /**
   * Extract route result on init
   *
   * @memberof RouteResultDialogComponent
   */
  ngOnInit(): void {
    this.extractRoute();
  }

  //

  /**
   *
   *
   * @param {number} index
   * @memberof RouteResultDialogComponent
   */
  setStep(index: number): void {
    this.step = index;
  }

  /**
   *
   *
   * @memberof RouteResultDialogComponent
   */
  nextStep(): void {
    this.step++;
  }

  /**
   *
   *
   * @memberof RouteResultDialogComponent
   */
  prevStep(): void {
    this.step--;
  }

  /**
   *
   *
   * @memberof RouteResultDialogComponent
   */
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
