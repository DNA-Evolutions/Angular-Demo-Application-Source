import { Component, Input, OnInit } from '@angular/core';


import { OpeningHours, GeoNode, RouteElementDetail } from 'build/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';

@Component({
    selector: 'app-resource-detail',
    templateUrl: 'resource-detail.component.html'
})
export class ResourceDetailComponent implements OnInit {

    @Input() resourceId: string;

    curDetail?: RouteElementDetail;

    constructor(
        private dataService: OptimizationWrapperService) { }

    ngOnInit(): void {

        const curResult = this.dataService.optimizationOutput();

        if (curResult !== undefined) {

            //this.curDetail = OptimizationWrapperService.nodeResult(this.nodeId, curResult);


        } else {
            //console.log('Found no result');
        }

    }

}
