import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OptimizationConfigJSONConfig, ElementConnection } from 'build/openapi';

import { environment } from 'src/environments/environment';
import { JOptExampleDefinition } from './interface/jopt-example-defintion';
import { MapViewDefinition } from '../leaflet-map/interface/map-view-defintion';

/**
 * Service to load predefined examples, parse and provide the data to other components.
 *
 * @export
 * @class LoadExampleDataService
 */
@Injectable({
  providedIn: 'root',
})
export class LoadExampleDataService {
  defaultExampleId = 'exampleOne';

  private exampleDefs: JOptExampleDefinition[];

  private curDef: JOptExampleDefinition;
  private defaultOptimizationInput: OptimizationConfigJSONConfig = null;
  private geoConnections: ElementConnection[];
  private geoRoutes: object[];
  private mapViewDefintion: MapViewDefinition;

  constructor(private http: HttpClient) {}

  /**
   * The extracted Example Input
   *
   * @return {*}  {OptimizationConfigJSONConfig}
   * @memberof LoadExampleDataService
   */
  public optimizationInput(): OptimizationConfigJSONConfig {
    return this.defaultOptimizationInput;
  }

  /**
   *
   * All extracted predefined element connections

   * @return {*}  {ElementConnection[]}
   * @memberof LoadExampleDataService
   */
  public connections(): ElementConnection[] {
    return this.geoConnections;
  }

  /**
   * Extracted connections of certain element ids.
   *
   * @param {string[]} ids
   * @return {*}  {ElementConnection[]}
   * @memberof LoadExampleDataService
   */
  public extractEdgeConnections(ids: string[]): ElementConnection[] {
    return this.geoConnections.filter((c) =>
      this.isDesiredConnectionsMember(ids, c)
    );
  }

  /**
   *
   *
   * @private
   * @param {string[]} ids
   * @param {ElementConnection} c
   * @return {*}  {boolean}
   * @memberof LoadExampleDataService
   */
  private isDesiredConnectionsMember(
    ids: string[],
    c: ElementConnection
  ): boolean {
    if (c.fromElementId === c.toElementId) {
      return false;
    }

    return ids.indexOf(c.fromElementId) > -1 && ids.indexOf(c.toElementId) > -1;
  }

  /**
   *
   *
   * @return {*}  {object[]}
   * @memberof LoadExampleDataService
   */
  public routes(): object[] {
    return this.geoRoutes;
  }

  /**
   *
   *
   * @return {*}  {MapViewDefinition}
   * @memberof LoadExampleDataService
   */
  public mapViewDef(): MapViewDefinition {
    return this.mapViewDefintion;
  }

  /**
   *
   *
   * @return {*}  {JOptExampleDefinition[]}
   * @memberof LoadExampleDataService
   */
  public getExampledDefs(): JOptExampleDefinition[] {
    return this.exampleDefs;
  }

  /**
   *
   *
   * @private
   * @param {string} exampleId
   * @return {*}  {JOptExampleDefinition}
   * @memberof LoadExampleDataService
   */
  private getExampleDef(exampleId: string): JOptExampleDefinition {
    return this.exampleDefs.find((d) => d.exampleId === exampleId);
  }

  // Loaders

  /**
   *
   *
   * @return {*}  {Promise<unknown>}
   * @memberof LoadExampleDataService
   */
  public loadDefaultExample(): Promise<unknown> {
    return this.loadExample(this.defaultExampleId);
  }

  /**
   *
   *
   * @param {string} exampleId
   * @return {*}  {Promise<unknown>}
   * @memberof LoadExampleDataService
   */
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

  /**
   *
   *
   * @param {string} path
   * @return {*}  {Promise<JOptExampleDefinition[]>}
   * @memberof LoadExampleDataService
   */
  loadExampleHelper(path: string): Promise<JOptExampleDefinition[]> {
    return new Promise<JOptExampleDefinition[]>((resolve) => {
      this.http.get(path).subscribe((data: JOptExampleDefinition[]) => {
        this.exampleDefs = data;
        resolve(this.exampleDefs);
      });
    });
  }

  /**
   *
   *
   * @param {string} path
   * @return {*}  {Promise<ElementConnection[]>}
   * @memberof LoadExampleDataService
   */
  loadGeoConnections(path: string): Promise<ElementConnection[]> {
    return new Promise((resolve) => {
      this.http.get(path).subscribe((data: any) => {
        this.geoConnections = data;
        resolve(data);
      });
    });
  }

  /**
   *
   *
   * @param {string} path
   * @return {*}  {Promise<any>}
   * @memberof LoadExampleDataService
   */
  loadGeoRoutes(path: string): Promise<any> {
    return new Promise((resolve) => {
      this.http.get(path).subscribe((data: any) => {
        this.geoRoutes = data;
        resolve(data);
      });
    });
  }

  /**
   *
   *
   * @param {string} path
   * @return {*}  {Promise<MapViewDefinition>}
   * @memberof LoadExampleDataService
   */
  loadMapViewDefintion(path: string): Promise<MapViewDefinition> {
    return new Promise((resolve) => {
      this.http.get(path).subscribe((data: any) => {
        this.mapViewDefintion = data;
        resolve(data);
      });
    });
  }

  /**
   *
   *
   * @param {string} path
   * @return {*}  {Promise<OptimizationConfigJSONConfig>}
   * @memberof LoadExampleDataService
   */
  loadOptimizationInput(path: string): Promise<OptimizationConfigJSONConfig> {
    return new Promise((resolve) => {
      this.http.get(path).subscribe((data: OptimizationConfigJSONConfig) => {
        this.defaultOptimizationInput = data;
        resolve(data);
      });
    });
  }
}
