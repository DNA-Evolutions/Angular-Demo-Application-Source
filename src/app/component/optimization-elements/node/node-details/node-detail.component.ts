import { Component, Input, OnInit } from '@angular/core';
import { RouteElementDetail } from 'build/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';

/**
 * The Component to show node result details of the last optimization run.
 *
 * @export
 * @class NodeDetailComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-node-detail',
  templateUrl: 'node-detail.component.html',
  styleUrls: ['./node-detail.component.scss'],
})
export class NodeDetailComponent implements OnInit {
  @Input() nodeId: string;

  @Input() detail: RouteElementDetail;

  curDetail?: RouteElementDetail;

  public moreDetailsState: boolean;

  constructor(private dataService: OptimizationWrapperService) {}

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
   *
   *
   * @param {*} input
   * @param {number} compare
   * @return {*}  {boolean}
   * @memberof NodeDetailComponent
   */
  public isBigger(input: any, compare: number): boolean {
    return <number>input > compare;
  }
}
