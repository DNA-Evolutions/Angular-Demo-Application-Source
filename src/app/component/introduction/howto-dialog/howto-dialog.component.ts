import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-howto-video-dialog',
  templateUrl: 'howto-dialog.component.html',
  styleUrls: ['howto-dialog.component.scss'],
})
export class HowtoDialogComponent implements OnInit {

  @Input() ytVideoId: string;
  safeUrl: any;

  curVideoId?: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<HowtoDialogComponent>,
    private _sanitizer: DomSanitizer
  ) {
    this.extractVideoId();
    this.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.curVideoId}`
    );
  }

  ngOnInit() {}

  close() {
    this.dialogRef.close('Play Youtube Video Closed');
  }

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
