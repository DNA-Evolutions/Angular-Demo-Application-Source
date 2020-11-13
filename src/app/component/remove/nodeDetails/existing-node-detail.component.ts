import { Component, Input, OnInit } from '@angular/core';

import { InputOptimizationDataService } from '../../inputDataService/input-optimization-data.service';

import { JOptOpeningHours, JOptGeoNode, JOptRouteElementDetail } from 'build/openapi';

@Component({
  selector: 'app-existing-node-detail',
  templateUrl: 'existing-node-detail.component.html'
})
export class ExistingNodeDetailComponent implements OnInit {

  @Input() nodeId: string;

  curDetail?: JOptRouteElementDetail;

  constructor(
    private dataService: InputOptimizationDataService) { }

  ngOnInit(): void {
    //console.log('ExistingNodeDetailComponent');

    const curResult = this.dataService.optimizationOutput();

    //console.log('Searching detail for ' + this.nodeId);

    if (curResult !== undefined) {
      //console.log('Found existing result');

      //console.log(curResult);
      this.curDetail = InputOptimizationDataService.nodeResult(this.nodeId, curResult);

      //console.log(this.curDetail);

    } else {
      //console.log('Found no result');
    }

  }

}
