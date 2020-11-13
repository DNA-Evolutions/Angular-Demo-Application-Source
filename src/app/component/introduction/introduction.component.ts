import { Component } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { HowtoDialogComponent } from './howto-dialog/howto-dialog.component';

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
    //dialogConfig.height = relativeHeight + 'px';
    dialogConfig.maxHeight = '95%';

    console.log("innerWidth: "+innerWidth)
    console.log("relativeWidth: "+relativeWidth)
    console.log("relativeHeight: "+relativeHeight)
    //console.log('innerWidth: '+ innerWidth);
    //console.log('relativeHeight: '+ relativeHeight);
    //console.log('relativeWidth: '+ relativeWidth);

    dialogConfig.data = {
      ytVideoId: '2q7cYYArKm8',
    };

    const dialogRef = this.dialog.open(HowtoDialogComponent, dialogConfig);

    /*     const dialogRef = this.dialog.open(HowtoDialogComponent, {
      minWidth: '80%',
        maxHeight: '100%',
        maxWidth: '1920px',
        disableClose: true,
        data: { ytVideoId: 'odyQUSG8do4' }
    }); */

    dialogRef.afterClosed().subscribe((result) => {
      //console.log('HowtoDialog dialog closed: ');
    });
  }
}
