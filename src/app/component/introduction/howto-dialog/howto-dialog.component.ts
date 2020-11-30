import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

/**
 *
 *
 * @export
 * @class HowtoDialogComponent
 */
@Component({
  selector: 'app-howto-video-dialog',
  templateUrl: 'howto-dialog.component.html',
  styleUrls: ['howto-dialog.component.scss'],
})
export class HowtoDialogComponent {
  @Input() ytVideoId: string;
  safeUrl: any;

  curVideoId?: string;

  /**
   * Get the currently defined url of the HowtoVideo for this demo app (short version).
   *
   * @return {*}  {string}
   * @memberof HowtoDialogComponent
   */
  public getYTShortUrl(): string {
    return `https://y2u.be/${this.curVideoId}`;
  }

  /**
   * Get the currently defined embeded url of the HowtoVideo for this demo app.
   *
   * @return {*}  {string}
   * @memberof HowtoDialogComponent
   */
  public getYTUrl(): string {
    return `https://www.youtube.com/embed/${this.curVideoId}`;
  }

  /**
   * Creates an instance of HowtoDialogComponent.
   * @param {*} data
   * @param {MatDialogRef<HowtoDialogComponent>} dialogRef
   * @param {DomSanitizer} _sanitizer
   * @memberof HowtoDialogComponent
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<HowtoDialogComponent>,
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
   * @memberof HowtoDialogComponent
   */
  close() {
    this.dialogRef.close('Play Youtube Video Closed');
  }

  /**
   *
   *
   * @private
   * @return {*}  {void}
   * @memberof HowtoDialogComponent
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
