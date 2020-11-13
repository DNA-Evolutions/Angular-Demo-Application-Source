// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


// http://jopttouroptimizer-on8081.westeurope.azurecontainer.io:8081/swagger-ui.html
export const environment = {
  production: false,
  host : 'http://localhost',
  //host : 'http://jopttouroptimizer-on8081.westeurope.azurecontainer.io',
  port : '8081',

  apiProgress: '/api/optimization/stream/progress',
  apiWarning: '/api/optimization/stream/warning',
  health: '/actuator/health',
  exampleAssertHelperPath: './assets/precoded-data/example-asserts-helper.json',
  howoyoutubeId:"odyQUSG8do4"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
