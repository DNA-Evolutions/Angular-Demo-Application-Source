import {
  Component,
  OnInit,
} from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { FormControl } from '@angular/forms';
import { LoadExampleDataService } from './_services/load-example-data/load-example-data.service';
import { OptimizationWrapperService } from './_services/optimization-wrapper/optimization-wrapper.service';
import { MatDialog } from '@angular/material/dialog';
import { IntroductionComponent } from './component/introduction/introduction.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  exampleDefaultId = 'exampleOne';
  exampleId: string;

  curExampleId: string;

  //
  exampleIdChangesSubject: BehaviorSubject<string>;

  title = 'JOpt.TourOptimizer - Demo Application';
  description = 'Optimization framework for Tour Optimization';

  desiredNodeId = new FormControl('');

  constructor(
    private loadService: LoadExampleDataService,
    private dataService: OptimizationWrapperService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.exampleIdChangesSubject = new BehaviorSubject(this.exampleDefaultId);

    this.exampleIdChangesSubject.subscribe(() => {});
  }

  updateDesiredNodeId(): void {
    this.desiredNodeId.setValue('');
  }

  async loadExample(exampleId: string): Promise<unknown> {
    const promise = await this.loadService.loadExample(exampleId);
    this.dataService.init();
    this.exampleIdChangesSubject.next(exampleId);
    return promise;
  }

  public setExampelId(id: string): void {
    this.curExampleId = id;
  }

  openIntroductionDialog(): void {
    const dialogRef = this.dialog.open(IntroductionComponent, {
      minWidth: '40vh',
      maxWidth: '90vh',
      maxHeight: '90vh',
      disableClose: false,
      data: {},
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
}
