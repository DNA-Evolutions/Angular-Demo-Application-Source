import { Component, Input, OnInit } from '@angular/core';
import { JOptRouteElementDetail } from 'build/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';

@Component({
  selector: 'app-node-detail',
  templateUrl: 'node-detail.component.html',
  styleUrls: ['./node-detail.component.scss'],
})
export class NodeDetailComponent implements OnInit {
  @Input() nodeId: string;

  @Input() detail: JOptRouteElementDetail;

  curDetail?: JOptRouteElementDetail;

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

  public isBigger(input: any, compare: number): boolean {
    return <number>input > compare;
  }
}
