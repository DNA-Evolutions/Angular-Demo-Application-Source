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

  public getYTShortUrl(){
    return `https://y2u.be/${this.curVideoId}`;
  }

  public getYTUrl(){
    return `https://www.youtube.com/embed/${this.curVideoId}`;
  }

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
