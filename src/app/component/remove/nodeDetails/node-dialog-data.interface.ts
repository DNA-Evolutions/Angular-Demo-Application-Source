import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface NodeDetailDialogData {
  animal: string;
  nodeId: string;
}