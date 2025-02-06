import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-consent',
    templateUrl: './consent.component.html',
    styleUrls: ['./consent.component.scss'],
    standalone: false
})
export class ConsentComponent {

  constructor(private router: Router) { }

  acceptConsent(): void {
    console.log('Consent accepted');
    // Navigate to /example route
    this.router.navigate(['/example']);
  }

  declineConsent(): void {
    console.log('Consent declined');
    // Optionally handle decline case
  }
}