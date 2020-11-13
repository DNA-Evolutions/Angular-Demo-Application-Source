import { Component, Input, OnInit, Inject, ElementRef, AfterContentInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ViewChild } from '@angular/core';

import { JOptOpeningHours, JOptGeoNode, JOptRouteElementDetail, JOptRoute, JOptOptimizationOutput } from 'build/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { Sort, MatSort } from '@angular/material/sort';
import { fromMatSort, fromMatPaginator, sortRows, paginateRows } from '../../../shared/datasource-utils';
import { RouteResultDialogComponent } from '../../route/route-result/route-result-dialog.component';


@Component({
    selector: 'app-opti-result-dialog',
    templateUrl: 'opti-rawr-dialog.component.html',
    styleUrls: ['./opti-rawr-dialog.component.scss'],
})
export class OptimizationRawRDialogComponent implements OnInit, AfterViewInit {

    //
    @Input() result: JOptOptimizationOutput;

    curResult?: JOptOptimizationOutput;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
        public dialogRef: MatDialogRef<OptimizationRawRDialogComponent>) { }


    private extractResult(): void {

        if (this.result !== undefined) {
            this.curResult = this.result;
        }


        if (this.result === undefined) {
            this.curResult = this.data.result;

            if (this.curResult !== undefined) {
                //console.log('Found existing result');
            } else {
                //console.log('Found no result');
            }

        }


    }


    ngOnInit(): void {
        this.extractResult();


    }

    ngAfterViewInit(): void {


        //
        if (this.curResult !== undefined) {


        }
    }


    //


    onCloseClick(): void {

        this.dialogRef.close();
    }
}
