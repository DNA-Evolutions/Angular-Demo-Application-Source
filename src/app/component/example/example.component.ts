import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

import { Observable } from 'rxjs';

import { OptimizationServiceControllerService } from 'build/openapi/api/optimizationServiceController.service';
import { JOptOptimizationProgress } from 'build/openapi';
import { FormControl } from '@angular/forms';
import { LoadExampleDataService } from 'src/app/_services/load-example-data/load-example-data.service';
import { JOptExampleDefinition } from 'src/app/_services/load-example-data/interface/jopt-example-defintion';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
})
export class ExampleComponent implements OnInit {

  @ViewChild('elselectoranchor', { static: false }) elSelectorRef: ElementRef;


  curExampleId = 'exampleOne';

  activeExampleId = 'exampleOne';


  constructor(
    private loadService: LoadExampleDataService,
    private dataService: OptimizationWrapperService,
    private ref: ChangeDetectorRef
  ) {
    //this.loadExample(this.exampleDefaultId).then(() => console.log('Task completed'));
  }

  public focusElementSelectorPanel(): void {
    this.elSelectorRef.nativeElement.scrollIntoView();
  }

  async loadExample(exampleId: string): Promise<unknown> {
    //console.log('LOADING DATA ' + exampleId);
    const promise = await this.loadService.loadExample(exampleId);
    this.dataService.init();
    //this.exampleIdChangesSubject.next(exampleId);
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
    //console.log('Setting id ' + id);
    this.curExampleId = id;
  }

  public getExampledDefs(): JOptExampleDefinition[] {
    return this.loadService.getExampledDefs();
  }

  ngOnInit(): void {}
}
