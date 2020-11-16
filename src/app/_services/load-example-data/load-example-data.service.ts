import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JOptOptimizationInput, JOptEdgeConnection } from 'build/openapi';

import { environment } from 'src/environments/environment';
import { JOptExampleDefinition } from './interface/jopt-example-defintion';
import { MapViewDefinition } from '../leaflet-map/interface/map-view-defintion';

@Injectable({
  providedIn: 'root',
})
export class LoadExampleDataService {
  defaultExampleId = 'exampleOne';

  private exampleDefs: JOptExampleDefinition[];

  private curDef: JOptExampleDefinition;
  private defaultOptimizationInput: JOptOptimizationInput = null;
  private geoConnections: JOptEdgeConnection[];
  private geoRoutes: object[];
  private mapViewDefintion: MapViewDefinition;

  constructor(private http: HttpClient) {}

  public optimizationInput(): JOptOptimizationInput {
    return this.defaultOptimizationInput;
  }

  public connections(): JOptEdgeConnection[] {
    return this.geoConnections;
  }

  public extractEdgeConnections(ids: string[]): JOptEdgeConnection[] {
    return this.geoConnections.filter((c) =>
      this.isDesiredConnectionsMember(ids, c)
    );
  }

  private isDesiredConnectionsMember(
    ids: string[],
    c: JOptEdgeConnection
  ): boolean {
    if (c.fromId === c.toId) {
      return false;
    }

    return ids.indexOf(c.fromId) > -1 && ids.indexOf(c.toId) > -1;
  }

  public routes(): object[] {
    return this.geoRoutes;
  }

  public mapViewDef(): MapViewDefinition {
    return this.mapViewDefintion;
  }

  public getExampledDefs(): JOptExampleDefinition[] {
    return this.exampleDefs;
  }

  private getExampleDef(exampleId: string): JOptExampleDefinition {
    return this.exampleDefs.find((d) => d.exampleId === exampleId);
  }

  // Loaders
  public loadDefaultExample(): Promise<unknown> {
    return this.loadExample(this.defaultExampleId);
  }

  public async loadExample(exampleId: string): Promise<unknown> {
    return this.loadExampleHelper(environment.exampleAssertHelperPath)
      .then(() => {
        this.curDef = this.getExampleDef(exampleId);
        return this.loadOptimizationInput(this.curDef.optimizationInputPath);
      })
      .then(() => {
        return this.loadGeoConnections(this.curDef.matrixInputPath);
      })
      .then(() => {
        return this.loadGeoRoutes(this.curDef.routesInputPath);
      })
      .then(() => {
        return this.loadMapViewDefintion(this.curDef.mapViewPropertiesPath);
      });
  }

  // TODO use generics
  loadExampleHelper(path: string): Promise<JOptExampleDefinition[]> {
    //console.log('Trigger call');
    return new Promise<JOptExampleDefinition[]>((resolve) => {
      this.http.get(path).subscribe((data: JOptExampleDefinition[]) => {
        this.exampleDefs = data;
        //console.log(this.exampleDefs);
        resolve(this.exampleDefs);
      });
    });
  }

  loadGeoConnections(path: string): Promise<JOptEdgeConnection[]> {
    //console.log('Trigger call');
    return new Promise((resolve) => {
      this.http.get(path).subscribe((data: any) => {
        this.geoConnections = data;
        resolve(data);
      });
    });
  }

  // TODO add interface
  loadGeoRoutes(path: string): Promise<any> {
    //console.log('Trigger call');
    return new Promise((resolve) => {
      this.http.get(path).subscribe((data: any) => {
        //console.log(data);
        this.geoRoutes = data;
        resolve(data);
      });
    });
  }

  loadMapViewDefintion(path: string): Promise<MapViewDefinition> {
    //console.log('Trigger call');
    return new Promise((resolve) => {
      this.http.get(path).subscribe((data: any) => {
        //console.log(data);
        this.mapViewDefintion = data;
        resolve(data);
      });
    });
  }

  loadOptimizationInput(path: string): Promise<JOptOptimizationInput> {
    //console.log('Exttracting optimization input from: ', path);
    return new Promise((resolve) => {
      //console.log('Trigger call');
      this.http.get(path).subscribe((data: JOptOptimizationInput) => {
        //console.log(data);
        this.defaultOptimizationInput = data;
        resolve(data);
      });
    });
  }
}
