import { Component, Input, OnInit } from '@angular/core';
import { RouteElementDetail } from '@openapibuild/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';

/**
 * Component that displays detailed optimization results for a single node.
 *
 * @description Shows route element details (arrival time, departure time, violations, etc.)
 * for a specific node from the most recent optimization run. The detail can either be provided
 * directly via the `detail` input or resolved automatically from the optimization output
 * using the `nodeId` input.
 *
 * @export
 * @class NodeDetailComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-node-detail',
    templateUrl: 'node-detail.component.html',
    styleUrls: ['./node-detail.component.scss'],
    standalone: false
})
export class NodeDetailComponent implements OnInit {
  /** The ID of the node to display details for. Used to look up results if `detail` is not provided. */
  @Input() nodeId: string;

  /** Optional pre-resolved route element detail. When provided, takes precedence over nodeId lookup. */
  @Input() detail: RouteElementDetail;

  /** The resolved detail object used for template rendering. */
  curDetail?: RouteElementDetail;

  /** Toggle state controlling whether expanded details are shown in the template. */
  public moreDetailsState: boolean;

  /**
   * Creates an instance of NodeDetailComponent.
   *
   * @param {OptimizationWrapperService} dataService - Service providing access to optimization results.
   */
  constructor(private dataService: OptimizationWrapperService) {}

  /**
   * Initializes the component by resolving the route element detail.
   *
   * @description If a `detail` input is provided, it is used directly. Otherwise, the component
   * looks up the node's result from the current optimization output using the `nodeId`.
   */
  ngOnInit(): void {
    if (this.detail !== undefined) {
      this.curDetail = this.detail;
    } else {
      const curResult = this.dataService.optimizationOutput();

      if (curResult !== undefined) {
        this.curDetail = OptimizationWrapperService.nodeResult(
          this.nodeId,
          curResult
        );
      } else {
        // No result found
      }
    }
  }

  /**
   * Compares a numeric input against a threshold value.
   *
   * @description Utility method typically used in templates to conditionally style or display
   * elements when a value exceeds a given threshold (e.g., highlighting violations).
   *
   * @param {*} input - The value to compare (cast to number).
   * @param {number} compare - The threshold to compare against.
   * @returns {boolean} True if input is strictly greater than compare.
   */
  public isBigger(input: any, compare: number): boolean {
    return <number>input > compare;
  }
}
