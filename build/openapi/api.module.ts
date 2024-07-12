import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { HealthStatusService } from './api/healthStatus.service';
import { OptimizationService } from './api/optimization.service';
import { OptimizationFAFService } from './api/optimizationFAF.service';
import { OptimizationFAFServiceControllerService } from './api/optimizationFAFServiceController.service';
import { OptimizationHealthControllerService } from './api/optimizationHealthController.service';
import { OptimizationServiceControllerService } from './api/optimizationServiceController.service';
import { ReadDatabaseDownloadEncryptedServiceControllerService } from './api/readDatabaseDownloadEncryptedServiceController.service';
import { ReadDatabaseDownloadServiceControllerService } from './api/readDatabaseDownloadServiceController.service';
import { ReadDatabaseEncryptedServiceControllerService } from './api/readDatabaseEncryptedServiceController.service';
import { ReadDatabaseServiceControllerService } from './api/readDatabaseServiceController.service';
import { StreamService } from './api/stream.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
