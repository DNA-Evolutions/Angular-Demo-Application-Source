import {
  Component,
  OnInit,
} from '@angular/core';

import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {

    if (environment.showConsentPage) {
      this.router.navigate(['/consent']);
    } else {
      this.router.navigate(['/example']);
    }

  }
}
