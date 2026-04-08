import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PrepareRunOptimizationDialogComponent } from './prepare-run-optimization-dialog.component';
import { RestOptimization } from '@openapibuild/openapi';
import { Observable } from 'rxjs';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { OptimizationResultDialogComponent } from '../optimization-elements/result/optimization/optimization-result/opti-result-dialog.component';

/**
 * View component that serves as the entry point for starting an optimization run.
 *
 * @description Provides a button (or icon) that opens the prepare-run-optimization dialog.
 * It also subscribes to the optimization output observable so that the result dialog can
 * be opened once an optimization completes.
 *
 * @export
 * @class PrepareRunOptimizationViewComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-prepare-run-optimization-view',
    templateUrl: 'prepare-run-optimization-view.component.html',
    styleUrls: ['prepare-run-optimization-view.component.scss'],
    standalone: false
})
export class PrepareRunOptimizationViewComponent implements OnInit {
  /** Input flag to control whether the trigger is rendered as an icon or a full button. */
  @Input() asIcon: boolean;

  /** Resolved display mode based on the asIcon input. */
  public showAsIcon: boolean;

  /** Identifier for the node context (used when opening dialogs). */
  nodeId: string;

  /** Observable stream of optimization results, emitting whenever a new result is available. */
  myOptimizationOutput$: Observable<RestOptimization>;

  /**
   * Creates an instance of PrepareRunOptimizationViewComponent.
   *
   * @param {MatDialog} dialog - Angular Material dialog service.
   * @param {OptimizationWrapperService} dataService - Service providing optimization data and operations.
   */
  constructor(
    public dialog: MatDialog,
    private dataService: OptimizationWrapperService
  ) {
    this.myOptimizationOutput$ = this.dataService.optimizationOutputObservable();
  }

  /**
   * Initializes the component display mode based on the asIcon input binding.
   */
  public ngOnInit(): void {
    if (this.asIcon !== undefined) {
      this.showAsIcon = this.asIcon;
    } else {
      this.showAsIcon = false;
    }
  }

  /**
   * Opens the prepare-run-optimization dialog where the user can review and adjust settings.
   */
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

  /**
   * Opens the optimization result dialog to display the outcome of a completed optimization.
   *
   * @param {RestOptimization} output - The optimization result data to display.
   */
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
