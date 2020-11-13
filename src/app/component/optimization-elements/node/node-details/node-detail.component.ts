import { Component, Input, OnInit } from '@angular/core';


import { JOptOpeningHours, JOptGeoNode, JOptRouteElementDetail } from 'build/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
//import { DatePipe } from '@angular/common'

import * as moment from 'moment';
import { DateFormatPipe } from 'src/app/pipe/date/date-format.pipe';

@Component({
    selector: 'app-node-detail',
    templateUrl: 'node-detail.component.html',
    styleUrls: ['./node-detail.component.scss'],
})
export class NodeDetailComponent implements OnInit {

    @Input() nodeId: string;

    @Input() detail: JOptRouteElementDetail;

    curDetail?: JOptRouteElementDetail;

    constructor(
        private dataService: OptimizationWrapperService) { }

    ngOnInit(): void {
        //console.log('app-node-detail');

        if (this.detail !== undefined) {

            this.curDetail = this.detail;

        } else {
            const curResult = this.dataService.optimizationOutput();

            //console.log('Searching detail for ' + this.nodeId);

            if (curResult !== undefined) {
               //console.log('Found existing result');

                //console.log(curResult);
                this.curDetail = OptimizationWrapperService.nodeResult(this.nodeId, curResult);

                //console.log(this.curDetail);

            } else {
               // console.log('Found no result');
            }
        }

    }


    public isBigger(input: any, compare: number): boolean {
        return ((<number>input) > compare);
    }

}
