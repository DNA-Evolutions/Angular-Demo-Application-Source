import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EXTERNAL_LINKS } from 'src/app/_config/external-links';

/**
 * Consent/disclaimer page component displayed before the user can access the demo.
 *
 * @description When {@link environment.showConsentPage} is enabled, this component is
 * shown as the initial landing page. It presents terms or disclaimers that the user
 * must accept before proceeding to the main optimization demo. This is useful for
 * GDPR compliance or other legal requirements in hosted deployments.
 *
 * @export
 * @class ConsentComponent
 */
@Component({
    selector: 'app-consent',
    templateUrl: './consent.component.html',
    styleUrls: ['./consent.component.scss'],
    standalone: false
})
export class ConsentComponent {
  readonly links = EXTERNAL_LINKS;

  /**
   * Creates an instance of ConsentComponent.
   *
   * @param {Router} router - Angular router used to navigate away from the consent page
   */
  constructor(private router: Router) { }

  /**
   * Handles the user accepting the consent/disclaimer.
   *
   * @description Logs the acceptance and navigates the user to the main example page
   * where the optimization demo is displayed.
   */
  acceptConsent(): void {
    console.log('Consent accepted');
    // Navigate to /example route
    this.router.navigate(['/example']);
  }

  /**
   * Handles the user declining the consent/disclaimer.
   *
   * @description Logs the decline. Currently no further action is taken, but this
   * method can be extended to show an error message or redirect to an external page.
   */
  declineConsent(): void {
    console.log('Consent declined');
    // Optionally handle decline case
  }
}