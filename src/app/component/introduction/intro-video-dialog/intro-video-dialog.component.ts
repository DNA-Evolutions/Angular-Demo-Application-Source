import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Dialog component that displays an embedded YouTube introduction video.
 *
 * @description Renders an iframe with a YouTube embed URL for the introductory
 * tutorial video. The video ID is provided either as an `@Input()` property or
 * through the Material dialog data injection. The URL is sanitized via Angular's
 * {@link DomSanitizer} to allow safe iframe embedding.
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
  /** YouTube video ID passed as an input binding (alternative to dialog data). */
  @Input() ytVideoId: string;

  /** Sanitized URL safe for use in an iframe src attribute. */
  safeUrl: any;

  /** The resolved YouTube video ID used to construct embed URLs. */
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
   * Closes the introduction video dialog.
   *
   * @description Closes the dialog and returns a descriptive result string.
   *
   * @memberof IntroVideoDialogComponent
   */
  close() {
    this.dialogRef.close('Play Youtube Video Closed');
  }

  /**
   * Extracts the YouTube video ID from available sources.
   *
   * @description Checks the `@Input()` property first, then falls back to the
   * dialog data injection. Sets {@link curVideoId} with the resolved value.
   *
   * @private
   * @returns {void}
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
