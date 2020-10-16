import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

import { OptimizationServiceControllerService } from 'build/openapi/api/optimizationServiceController.service';
import { JOptOptimizationProgress } from 'build/openapi';
import { FormControl } from '@angular/forms';
import { LoadExampleDataService } from './_services/load-example-data/load-example-data.service';
import { OptimizationWrapperService } from './_services/optimization-wrapper/optimization-wrapper.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    //changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

    exampleDefaultId = 'exampleOne';
    exampleId: string;


    curExampleId: string;


    //
    exampleIdChangesSubject: BehaviorSubject<string>;

    title = 'JOpt-TourOptimizer Angular-Swagger Example Front-End';
    description = 'Optimization framework for Tour Optimization';

    public markers: { lat: number, long: number }[];   // Map markers (relevance depends on map center)


    desiredNodeId = new FormControl('');

    constructor(private loadService: LoadExampleDataService,
        private dataService: OptimizationWrapperService,
        //private cd: ChangeDetectorRef
        ) {



        // some map markers
        this.markers = [
            { lat: 32.9756, long: -96.89 },
            { lat: 33.1543, long: -96.8352 },
            { lat: 32.93, long: -96.8195 },
            { lat: 32.8998, long: -97.0403 },
            { lat: 33.0737, long: -96.3697 },
            { lat: 33.1014, long: -96.6744 }
        ];
    }

    ngOnInit() {
        this.exampleIdChangesSubject = new BehaviorSubject(this.exampleDefaultId);
        
        this.exampleIdChangesSubject.subscribe(
            (val) => {
                console.log(val);
                //this.cd.detectChanges();
            }
        );
    }

    updateDesiredNodeId(): void {
        this.desiredNodeId.setValue('');
    }

    async loadExample(exampleId: string): Promise<unknown> {
        console.log('LOADING DATA ' + exampleId);
        const promise = await this.loadService.loadExample(exampleId);
        this.dataService.init();
        this.exampleIdChangesSubject.next(exampleId);
        return promise;
    }

    public setExampelId(id: string): void {
        console.log('Setting id ' + id);
        this.curExampleId = id;


    }

}

