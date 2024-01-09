import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

// Componenets
import { AppComponent } from './app.component';

// Modules
import { ApiModule } from 'build/openapi/api.module';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Service
import { OptimizationServiceControllerService } from 'build/openapi/api/optimizationServiceController.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

//import {
//  NgxMatDatetimePickerModule,
//  NgxMatTimepickerModule,
// NgxMatNativeDateModule,
//} from '@angular-material-components/datetime-picker';
import { PrepareRunOptimizationDialogComponent } from './component/optimization-run/prepare-run-optimization-dialog.component';
import { PrepareRunOptimizationViewComponent } from './component/optimization-run/prepare-run-optimization-view.component';
import { RunOptimizationDialogComponent } from './component/optimization-run/run-optimization-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProgressComponent } from './component/optimization-events/progress/progress.component';
import { MatTabsModule } from '@angular/material/tabs';

import { MatTooltipModule } from '@angular/material/tooltip';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatBadgeModule } from '@angular/material/badge';

import { LeafletMapComponent } from './component/leaflet-map/leaflet-map.component';

import { ExampleComponent } from './component/example/example.component';
import { GeoAndRoutingService } from './_services/geo-and-routing/geo-and-routing.service';
import { LoadExampleDataService } from './_services/load-example-data/load-example-data.service';
import { NodePropertiesComponent } from './component/optimization-elements/node/node-properties.component';
import { NodePropertiesDialogComponent } from './component/optimization-elements/node/node-properties-dialog.component';
import { NodeDetailComponent } from './component/optimization-elements/node/node-details/node-detail.component';
import { OptimizationWrapperService } from './_services/optimization-wrapper/optimization-wrapper.service';
import { LeafletMarkerService } from './_services/leaflet-map/marker/leaflet-marker.service';
import { ResourcePropertiesDialogComponent } from './component/optimization-elements/resource/resource-properties-dialog.component';
import { ResourceDetailComponent } from './component/optimization-elements/resource/resource-details/resource-detail.component';
import { ValidTimeWindowDirective } from './component/optimization-elements/shared/valid-time-window.directive';

import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatSelectModule } from '@angular/material/select';
import { RouteResultDialogComponent } from './component/optimization-elements/result/route/route-result/route-result-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { DateFormatPipe } from './pipe/date/date-format.pipe';
import { MatListModule } from '@angular/material/list';
import { DurationFormatPipe } from './pipe/duration/duration-format.pipe';
import { DistanceFormatPipe } from './pipe/distance/distance-format.pipe';
import { OptimizationResultDialogComponent } from './component/optimization-elements/result/optimization/optimization-result/opti-result-dialog.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatStepperModule } from '@angular/material/stepper';
import { OptimizationElementsSelectorComponent } from './component/optimization-elements-selector/optimization-elements-selector.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { OptimizationRawRDialogComponent } from './component/optimization-elements/result/optimization/optimization-raw-result/opti-rawr-dialog.component';
import { BASE_PATH } from 'build/openapi';
import { environment } from 'src/environments/environment';
import { IntroductionComponent } from './component/introduction/introduction.component';
import { HowtoDialogComponent } from './component/introduction/howto-dialog/howto-dialog.component';
import { IntroVideoDialogComponent } from './component/introduction/intro-video-dialog/intro-video-dialog.component';

import { CustomDateTimePickerComponent } from './component/custom-date-time-picker/custom-date-time-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    //
    PrepareRunOptimizationDialogComponent,
    PrepareRunOptimizationViewComponent,
    //
    RunOptimizationDialogComponent,
    //
    ProgressComponent,
    //
    LeafletMapComponent,
    //
    ExampleComponent,
    //
    NodePropertiesComponent,
    NodePropertiesDialogComponent,
    NodeDetailComponent,
    //
    ResourceDetailComponent,
    ResourcePropertiesDialogComponent,
    //
    ValidTimeWindowDirective,

    //
    RouteResultDialogComponent,
    //
    DateFormatPipe,
    DurationFormatPipe,
    DistanceFormatPipe,

    //
    OptimizationResultDialogComponent,
    //
    OptimizationElementsSelectorComponent,
    //
    OptimizationRawRDialogComponent,
    //
    IntroductionComponent,
    //
    HowtoDialogComponent,
    //
    IntroVideoDialogComponent,
    CustomDateTimePickerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ApiModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatCardModule,
    //NgxMatDatetimePickerModule,
    //NgxMatTimepickerModule,
    //NgxMatNativeDateModule,
    MatExpansionModule,
    MatButtonModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule,
    MatSliderModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTooltipModule,
    NgxChartsModule,
    MatBadgeModule,

    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    MatStepperModule,
    ScrollingModule,



  ],
  providers: [
    OptimizationServiceControllerService,
    [
      {
        provide: BASE_PATH,
        useValue: environment.host + ':' + environment.port,
      },
    ],
    OptimizationWrapperService,
    GeoAndRoutingService,
    LoadExampleDataService,

    {
      provide: APP_INITIALIZER,
      useFactory: exampleDataProviderFactory,
      deps: [LoadExampleDataService],
      multi: true,
    },

    LeafletMarkerService,
  ],
  /*entryComponents: [
    PrepareRunOptimizationDialogComponent,
    RunOptimizationDialogComponent,
    NodePropertiesDialogComponent,
    ResourcePropertiesDialogComponent,
    RouteResultDialogComponent,
    OptimizationResultDialogComponent,
    OptimizationRawRDialogComponent,
    IntroductionComponent,
    HowtoDialogComponent,
    IntroVideoDialogComponent,
  ],*/
  bootstrap: [AppComponent],
})
export class AppModule {}

export function exampleDataProviderFactory(provider: LoadExampleDataService) {
  return () => provider.loadDefaultExample();
}
