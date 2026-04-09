import { Component } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { HowtoDialogComponent } from './howto-dialog/howto-dialog.component';

import { environment } from '@env/environment';
import { IntroVideoDialogComponent } from './intro-video-dialog/intro-video-dialog.component';
import packageJson from '../../../../package.json';
import { EXTERNAL_LINKS } from 'src/app/_config/external-links';

/**
 * Introduction and help dialog component for the TourOptimizer demo application.
 *
 * @description Displays version information, the currently configured API endpoint,
 * and provides buttons to open how-to and introduction YouTube video dialogs.
 * This component is opened as a Material dialog from the main example view.
 *
 * @export
 * @class IntroductionComponent
 */
@Component({
    selector: 'app-introduction',
    templateUrl: 'introduction.component.html',
    styleUrls: ['introduction.component.scss'],
    standalone: false
})
export class IntroductionComponent {

 readonly links = EXTERNAL_LINKS;

 /** The current application version, read from package.json. */
 myVersion: string;

 /** The OpenAPI/TourOptimizer specification version, read from package.json. */
 myOpenApiModelVersion: string;

  /**
   * Creates an instance of IntroductionComponent.
   *
   * @param {MatDialog} dialog - Angular Material dialog service for opening child dialogs
   * @param {MatDialogRef<IntroductionComponent>} dialogRef - Reference to the currently open dialog instance
   */
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<IntroductionComponent>
  ) {
    this.myVersion = packageJson.version;
    this.myOpenApiModelVersion = packageJson.touroptimizerspecversion; 
  }

  /**
   * Closing the help dialog
   *
   * @memberof IntroductionComponent
   */
  onCloseClick(): void {
    this.dialogRef.close();
  }

  /**
   *
   * Gets the currently defined swagger endpoint used for the optimization
   *
   * @return {*}  {string}
   * @memberof IntroductionComponent
   */
  public getCurrentDefinedHost(): string {
    return environment.host + ':' + environment.port;
  }

  /**
   * Opens the dialog for the HowTo video
   *
   * @memberof IntroductionComponent
   */
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

    dialogConfig.maxHeight = '90%';

    dialogConfig.data = {
      ytVideoId: environment.howtoYTIdent,
    };

    const dialogRef = this.dialog.open(HowtoDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      //
    });
  }

  /**
   * Opens the introduction video dialog with an embedded YouTube player.
   *
   * @description Calculates responsive dialog dimensions based on the viewport width
   * (capped at 1500px) and opens the {@link IntroVideoDialogComponent} with the
   * YouTube video ID configured in the environment.
   *
   * @memberof IntroductionComponent
   */
  openIntroductionVideoDialog(): void {
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

    dialogConfig.maxHeight = '90%';

    dialogConfig.data = {
      ytVideoId: environment.introYTIdent,
    };

    const dialogRef = this.dialog.open(IntroVideoDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      //
    });
  }
}
