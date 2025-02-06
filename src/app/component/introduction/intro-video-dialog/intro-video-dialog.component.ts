import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

/**
 *
 *
 * @export
 * @class IntroVideoDialogComponent
 */
@Component({
    selector: 'app-intro-video-dialog',
    templateUrl: 'intro-video-dialog.component.html',
    styleUrls: ['../howto-dialog/howto-dialog.component.scss'],
    standalone: false
})
export class IntroVideoDialogComponent {
  @Input() ytVideoId: string;
  safeUrl: any;

  curVideoId?: string;

  /**
   * Get the currently defined url of the IntroVideoUrl for this demo app (short version).
   *
   * @return {*}  {string}
   * @memberof IntroVideoDialogComponent
   */
  public getYTShortUrl(): string {
    return `https://y2u.be/${this.curVideoId}`;
  }

  /**
   * Get the currently defined embeded url of the HowtoVideo for this demo app.
   *
   * @return {*}  {string}
   * @memberof IntroVideoDialogComponent
   */
  public getYTUrl(): string {
    return `https://www.youtube.com/embed/${this.curVideoId}`;
  }

  /**
   * Creates an instance of IntroVideoDialogComponent.
   * @param {*} data
   * @param {MatDialogRef<IntroVideoDialogComponent>} dialogRef
   * @param {DomSanitizer} _sanitizer
   * @memberof IntroVideoDialogComponent
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<IntroVideoDialogComponent>,
    private _sanitizer: DomSanitizer
  ) {
    this.extractVideoId();
    this.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(
      this.getYTUrl()
    );
  }

  /**
   *
   *
   * @memberof IntroVideoDialogComponent
   */
  close() {
    this.dialogRef.close('Play Youtube Video Closed');
  }

  /**
   *
   *
   * @private
   * @return {*}  {void}
   * @memberof IntroVideoDialogComponent
   */
  private extractVideoId(): void {
    if (this.ytVideoId !== undefined) {
      this.curVideoId = this.ytVideoId;
      return;
    }

    if (this.data.ytVideoId !== undefined) {
      this.curVideoId = this.data.ytVideoId;
      return;
    }
  }
}
