import { Component, Input, OnInit, Inject } from '@angular/core';

import { RouteElementDetail, Route } from '@openapibuild/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EXTERNAL_LINKS } from 'src/app/_config/external-links';

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
    standalone: false
})
export class RouteResultDialogComponent implements OnInit {
  readonly links = EXTERNAL_LINKS;

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

  /** The currently expanded route element detail row in the expansion panel list. */
  expandedElement: RouteElementDetail | null;

  /** Tracks whether the expansion panel is open or closed. */
  public panelOpenState: boolean;

  /** Index of the currently active expansion panel step; -1 means none is open. */
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
   * Extracts the route object from all available sources.
   *
   * @description Resolves the route to display by checking, in order:
   * 1. The `@Input() route` property (direct binding)
   * 2. The `@Input() routeId` or dialog data `routeId` (looked up from optimization results)
   * 3. The dialog data `route` property (passed directly via dialog data)
   *
   * @private
   * @returns {void}
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
   * Sets the active expansion panel step to the given index.
   *
   * @param {number} index - The index of the panel to expand
   * @memberof RouteResultDialogComponent
   */
  setStep(index: number): void {
    this.step = index;
  }

  /**
   * Advances to the next expansion panel step.
   *
   * @memberof RouteResultDialogComponent
   */
  nextStep(): void {
    this.step++;
  }

  /**
   * Returns to the previous expansion panel step.
   *
   * @memberof RouteResultDialogComponent
   */
  prevStep(): void {
    this.step--;
  }

  /**
   * Closes the route result dialog.
   *
   * @memberof RouteResultDialogComponent
   */
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
