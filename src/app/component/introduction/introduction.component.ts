import { Component } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { HowtoDialogComponent } from './howto-dialog/howto-dialog.component';

import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-introduction',
  templateUrl: 'introduction.component.html',
  styleUrls: ['introduction.component.scss'],
})
export class IntroductionComponent {
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<IntroductionComponent>
  ) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }

  public getCurrentDefinedHost(): string {
    return environment.host + ':' + environment.port;
  }


  openHowtoDialog(): void {
    let takeUpPercentage = 85; // take up to 80% of the screen size

    const dialogConfig = new MatDialogConfig();

    let innerWidth = window.innerWidth;

    let relativeWidth = (innerWidth * takeUpPercentage) / 100;
    if (innerWidth > 1500) {
      relativeWidth = (1500 * takeUpPercentage) / 100;
    } else {
      relativeWidth = (innerWidth * takeUpPercentage) / 100;
    }

    const relativeHeight = (relativeWidth * 9) / 16 + 160; // 16:9 to which we add 160 px for the dialog action buttons ("close")
    dialogConfig.width = relativeWidth + 'px';

    dialogConfig.maxHeight = '95%';

    console.log('innerWidth: ' + innerWidth);
    console.log('relativeWidth: ' + relativeWidth);
    console.log('relativeHeight: ' + relativeHeight);


    dialogConfig.data = {
      ytVideoId: environment.howtoYTIdent,
    };

    const dialogRef = this.dialog.open(HowtoDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      //
    });
  }
}
