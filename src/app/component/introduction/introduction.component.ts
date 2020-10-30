import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-introduction',
  templateUrl: 'introduction.component.html',
  styleUrls: ['introduction.component.scss'],
})
export class IntroductionComponent {
  constructor(public dialogRef: MatDialogRef<IntroductionComponent>) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
