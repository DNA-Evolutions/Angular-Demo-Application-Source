import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrepareRunOptimizationDialogComponent } from './prepare-run-optimization-dialog.component';
import { JOptOpeningHours, JOptGeoNode, JOptOptimizationRunOptions, JOptOptimizationOutput } from 'build/openapi';
import { RunOptimizationDialogComponent } from './run-optimization-dialog.component';
import { Observable } from 'rxjs';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { OptimizationResultDialogComponent } from '../optimization-elements/result/optimization/optimization-result/opti-result-dialog.component';


@Component({
    selector: 'app-prepare-run-optimization-view',
    templateUrl: 'prepare-run-optimization-view.component.html',
    styleUrls: ['prepare-run-optimization-view.component.scss']
})
export class PrepareRunOptimizationViewComponent implements OnInit {

  @Input() asIcon: boolean;
  public showAsIcon: boolean;

    nodeId: string;
    myOptimizationOutput$: Observable<JOptOptimizationOutput>;

    constructor(public dialog: MatDialog, private dataService: OptimizationWrapperService) {
        this.myOptimizationOutput$ = this.dataService.optimizationOutputObservable();
    }

    public ngOnInit(): void{
      if (this.asIcon !== undefined) {
        this.showAsIcon = this.asIcon;
      } else {
        this.showAsIcon = false;
      }
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(PrepareRunOptimizationDialogComponent, {
            width: '1650px',
            maxHeight: '80vh',
            disableClose: true,
            data: { nodeId: this.nodeId }
        });

        dialogRef.afterClosed().subscribe(result => {

            console.log('Prepare dialog closed: ');
            //const runDialogRef: MatDialogRef<RunOptimizationDialogComponent> = result;

            //runDialogRef.afterClosed().subscribe(optimizationResult => {
            //  console.log('Got optimization result: ' + optimizationResult);
            //});

        });


    }

    openOptimizationResultDialog(output: JOptOptimizationOutput): void {
        console.log(output);
        const dialogRef = this.dialog.open(OptimizationResultDialogComponent, {
            width: '1000px',
            maxHeight: '80vh',
            data: { result: output }
        });

        dialogRef.afterClosed().subscribe(result => {


            //const runDialogRef: MatDialogRef<RunOptimizationDialogComponent> = result;

            //runDialogRef.afterClosed().subscribe(optimizationResult => {
            //  console.log('Got optimization result: ' + optimizationResult);
            //});

        });


    }

}
