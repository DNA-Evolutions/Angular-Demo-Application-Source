import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PrepareRunOptimizationDialogComponent } from './prepare-run-optimization-dialog.component';
import { RestOptimization } from '@openapibuild/openapi';
import { Observable } from 'rxjs';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { OptimizationResultDialogComponent } from '../optimization-elements/result/optimization/optimization-result/opti-result-dialog.component';

@Component({
    selector: 'app-prepare-run-optimization-view',
    templateUrl: 'prepare-run-optimization-view.component.html',
    styleUrls: ['prepare-run-optimization-view.component.scss'],
    standalone: false
})
export class PrepareRunOptimizationViewComponent implements OnInit {
  @Input() asIcon: boolean;
  public showAsIcon: boolean;

  nodeId: string;
  myOptimizationOutput$: Observable<RestOptimization>;

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
      minWidth: '40vw',
      maxWidth: '95vw',
      maxHeight: '85vh',
      disableClose: true,
      data: { nodeId: this.nodeId },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  openOptimizationResultDialog(output: RestOptimization): void {
    //console.log(output);
    const dialogRef = this.dialog.open(OptimizationResultDialogComponent, {
      minWidth: '80vw',
      maxWidth: '95vw',
      maxHeight: '85vh',
      data: { result: output },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
}
