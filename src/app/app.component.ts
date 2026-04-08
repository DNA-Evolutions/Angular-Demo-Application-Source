import {
  Component,
  OnInit,
} from '@angular/core';

import { Router } from '@angular/router';
import { environment } from '@env/environment';

/**
 * Root application component for the JOpt TourOptimizer Angular demo.
 *
 * @description This is the bootstrap component of the application. On initialization,
 * it checks the environment configuration to determine whether to display a consent
 * page first or navigate directly to the main example view. This allows deployments
 * to optionally require user consent (e.g. for GDPR compliance) before using the demo.
 *
 * @export
 * @class AppComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {

  /**
   * Creates an instance of AppComponent.
   *
   * @param {Router} router - Angular router used for navigation on startup
   */
  constructor(
    private router: Router
  ) { }

  /**
   * Lifecycle hook that runs after the component is initialized.
   *
   * @description Checks the {@link environment.showConsentPage} flag. If true,
   * navigates to the consent page; otherwise, navigates directly to the example page.
   */
  ngOnInit() {

    if (environment.showConsentPage) {
      this.router.navigate(['/consent']);
    } else {
      this.router.navigate(['/example']);
    }

  }
}
