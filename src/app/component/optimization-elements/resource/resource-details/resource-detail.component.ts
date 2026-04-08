import { Component, Input, OnInit } from '@angular/core';


import { OpeningHours, GeoNode, RouteElementDetail } from '@openapibuild/openapi';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';

/**
 * Component that displays detailed optimization results for a single resource.
 *
 * @description Placeholder component for showing route-level details (total distance,
 * total time, etc.) associated with a specific resource after an optimization run.
 * Currently retrieves the optimization output but does not yet map it to a specific
 * resource detail view.
 *
 * @export
 * @class ResourceDetailComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-resource-detail',
    templateUrl: 'resource-detail.component.html',
    standalone: false
})
export class ResourceDetailComponent implements OnInit {

    /** The ID of the resource to display details for. */
    @Input() resourceId: string;

    /** The resolved route element detail for the resource (not yet populated). */
    curDetail?: RouteElementDetail;

    /**
     * Creates an instance of ResourceDetailComponent.
     *
     * @param {OptimizationWrapperService} dataService - Service providing access to optimization results.
     */
    constructor(
        private dataService: OptimizationWrapperService) { }

    /**
     * Initializes the component by attempting to load the optimization result.
     *
     * @description Checks whether an optimization output exists. Resource-specific detail
     * mapping is not yet implemented.
     */
    ngOnInit(): void {

        const curResult = this.dataService.optimizationOutput();

        if (curResult !== undefined) {

            //this.curDetail = OptimizationWrapperService.nodeResult(this.nodeId, curResult);


        } else {
            //console.log('Found no result');
        }

    }

}
