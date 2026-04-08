import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsentComponent } from './component/consent/consent.component';
import { ExampleComponent } from './component/example/example.component';

/**
 * Application route definitions.
 *
 * - `/consent` - Displays the consent/disclaimer page (shown when {@link environment.showConsentPage} is true).
 * - `/example` - Displays the main demo view with optimization elements, map, and controls.
 */
const routes: Routes = [
  { path: 'consent', component: ConsentComponent },
  { path: 'example', component: ExampleComponent }
];

/**
 * Routing module for the JOpt TourOptimizer Angular demo.
 *
 * @description Registers the top-level routes for the application using Angular's
 * {@link RouterModule.forRoot}. The two primary routes direct users to either a consent
 * page or the main example/demo page.
 *
 * @export
 * @class AppRoutingModule
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
