import { Component, Input, OnInit, Inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';


import { JOptOpeningHours, JOptGeoNode, JOptRouteElementDetail, JOptRoute } from 'build/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-route-result-dialog',
    templateUrl: 'route-result-dialog.component.html',
    styleUrls: ['./route-result-dialog.component.scss'],
})
export class RouteResultDialogComponent implements OnInit {

    @Input() routeId: number;
    @Input() route: JOptRoute;

    curRoute?: JOptRoute;

    expandedElement: JOptRouteElementDetail | null;

    // During next and prev in nodes
    step = -1;

    constructor(
        private dataService: OptimizationWrapperService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<RouteResultDialogComponent>) { }


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
                console.log('Found existing result');

                console.log(curResult);
                this.curRoute = OptimizationWrapperService.routeResult(this.data.routeId, curResult);
            }

        }

        if (this.curRoute === undefined) {


            this.curRoute = this.data.route;


        }
    }


    ngOnInit(): void {

        this.extractRoute();

    }


    //


    setStep(index: number): void {
        this.step = index;
    }

    nextStep(): void {
        this.step++;
    }

    prevStep(): void {
        this.step--;
    }

    onCloseClick(): void {

        this.dialogRef.close();
    }

}
