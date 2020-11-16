import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PrepareRunOptimizationDialogComponent } from './prepare-run-optimization-dialog.component';
import { JOptOptimizationOutput } from 'build/openapi';
import { Observable } from 'rxjs';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { OptimizationResultDialogComponent } from '../optimization-elements/result/optimization/optimization-result/opti-result-dialog.component';

@Component({
  selector: 'app-prepare-run-optimization-view',
  templateUrl: 'prepare-run-optimization-view.component.html',
  styleUrls: ['prepare-run-optimization-view.component.scss'],
})
export class PrepareRunOptimizationViewComponent implements OnInit {
  @Input() asIcon: boolean;
  public showAsIcon: boolean;

  nodeId: string;
  myOptimizationOutput$: Observable<JOptOptimizationOutput>;

  constructor(
    public dialog: MatDialog,
    private dataService: OptimizationWrapperService
  ) {
    this.myOptimizationOutput$ = this.dataService.optimizationOutputObservable();
  }

  public ngOnInit(): void {
    if (this.asIcon !== undefined) {
      this.showAsIcon = this.asIcon;
    } else {
      this.showAsIcon = false;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PrepareRunOptimizationDialogComponent, {
      width: '90%',
      maxHeight: '95vh',
      disableClose: true,
      data: { nodeId: this.nodeId },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  openOptimizationResultDialog(output: JOptOptimizationOutput): void {
    //console.log(output);
    const dialogRef = this.dialog.open(OptimizationResultDialogComponent, {
      minWidth: '40%',
      maxWidth: '95%',
      maxHeight: '90%',
      data: { result: output },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
}
