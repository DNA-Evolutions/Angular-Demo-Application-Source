import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { LoadExampleDataService } from 'src/app/_services/load-example-data/load-example-data.service';
import { JOptExampleDefinition } from 'src/app/_services/load-example-data/interface/jopt-example-defintion';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
})
export class ExampleComponent {
  @ViewChild('elselectoranchor', { static: false }) elSelectorRef: ElementRef;

  curExampleId = 'exampleOne';

  activeExampleId = 'exampleOne';

  constructor(
    private loadService: LoadExampleDataService,
    private dataService: OptimizationWrapperService
  ) {}

  public focusElementSelectorPanel(): void {
    this.elSelectorRef.nativeElement.scrollIntoView();
  }

  async loadExample(exampleId: string): Promise<unknown> {
    const promise = await this.loadService.loadExample(exampleId);
    this.dataService.init();

    this.activeExampleId = exampleId;
    return promise;
  }

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

  public setExampelId(id: string): void {
    this.curExampleId = id;
  }

  public getExampledDefs(): JOptExampleDefinition[] {
    return this.loadService.getExampledDefs();
  }
}
