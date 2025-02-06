import { Component, ViewChild, ElementRef } from '@angular/core';

import { LoadExampleDataService } from 'src/app/_services/load-example-data/load-example-data.service';
import { JOptExampleDefinition } from 'src/app/_services/load-example-data/interface/jopt-example-defintion';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { IntroductionComponent } from '../introduction/introduction.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * Start up component showing the different expansion panels to control the demo application
 *
 * @export
 * @class ExampleComponent
 */
@Component({
    selector: 'app-example',
    templateUrl: './example.component.html',
    styleUrls: ['./example.component.scss'],
    standalone: false
})
export class ExampleComponent {
  @ViewChild('elselectoranchor', { static: false }) elSelectorRef: ElementRef;

  curExampleId = this.loadService.getDefaultExampleId();
  
  activeExampleId = this.loadService.getDefaultExampleId();

  currentYear = new Date().getFullYear();

  /**
   * Creates an instance of ExampleComponent.
   * @param {LoadExampleDataService} loadService
   * @param {OptimizationWrapperService} dataService
   * @memberof ExampleComponent
   */
  constructor(
    private loadService: LoadExampleDataService,
    private dataService: OptimizationWrapperService,
    public dialog: MatDialog
  ) {}

  /**
   *
   * Focus/Scroll on the Element selector part of the demo
   *
   * @memberof ExampleComponent
   */
  public focusElementSelectorPanel(): void {
    this.elSelectorRef.nativeElement.scrollIntoView();
  }

  /**
   *
   * Loads a new example into the demo applicaion defined by its example id
   *
   * @param {string} exampleId
   * @return {*}  {Promise<unknown>}
   * @memberof ExampleComponent
   */
  async loadExample(exampleId: string): Promise<unknown> {
    const promise = await this.loadService.loadExample(exampleId);
    this.dataService.init();

    this.activeExampleId = exampleId;
    return promise;
  }

  /**
   *
   * Gets the example desciption for a certain example id
   *
   * @param {string} exampleId
   * @return {*}  {string}
   * @memberof ExampleComponent
   */
  public getExampleDesc(exampleId: string): string {
    const examples = this.loadService
      .getExampledDefs()
      .filter((def) => def.exampleId === exampleId);
    if (examples !== undefined && examples.length > 0) {
      return examples[0].desc;
    } else {
      return 'Example Desciption not available.';
    }
  }

  /**
   *
   * Gets the example title for a certain example id
   *
   * @param {string} exampleId
   * @return {*}  {string}
   * @memberof ExampleComponent
   */
  public getExampleTitle(exampleId: string): string {
    const examples = this.loadService
      .getExampledDefs()
      .filter((def) => def.exampleId === exampleId);
    if (examples !== undefined && examples.length > 0) {
      return examples[0].title;
    } else {
      return 'Example Title not available.';
    }
  }

  /**
   *
   * Sets the current example by id
   *
   * @param {string} id
   * @memberof ExampleComponent
   */
  public setExampelId(id: string): void {
    this.curExampleId = id;
  }

  /**
   *
   * Gets all example defintions of this demo application
   *
   * @return {*}  {JOptExampleDefinition[]}
   * @memberof ExampleComponent
   */
  public getExampledDefs(): JOptExampleDefinition[] {
    return this.loadService.getExampledDefs();
  }

  openIntroductionDialog(): void {
    const dialogRef = this.dialog.open(IntroductionComponent, {
      minWidth: '10vw',
      maxWidth: '95vw',
      maxHeight: '95vh',
      disableClose: false,
      data: {},
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
}
