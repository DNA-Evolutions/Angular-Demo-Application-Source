import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JOptOptimizationInput, JOptEdgeConnection } from 'build/openapi';

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
  private defaultOptimizationInput: JOptOptimizationInput = null;
  private geoConnections: JOptEdgeConnection[];
  private geoRoutes: object[];
  private mapViewDefintion: MapViewDefinition;

  constructor(private http: HttpClient) {}

  /**
   * The extracted Example Input
   *
   * @return {*}  {JOptOptimizationInput}
   * @memberof LoadExampleDataService
   */
  public optimizationInput(): JOptOptimizationInput {
    return this.defaultOptimizationInput;
  }

  /**
   *
   * All extracted predefined element connections

   * @return {*}  {JOptEdgeConnection[]}
   * @memberof LoadExampleDataService
   */
  public connections(): JOptEdgeConnection[] {
    return this.geoConnections;
  }

  /**
   * Extracted connections of certain element ids.
   *
   * @param {string[]} ids
   * @return {*}  {JOptEdgeConnection[]}
   * @memberof LoadExampleDataService
   */
  public extractEdgeConnections(ids: string[]): JOptEdgeConnection[] {
    return this.geoConnections.filter((c) =>
      this.isDesiredConnectionsMember(ids, c)
    );
  }

  /**
   *
   *
   * @private
   * @param {string[]} ids
   * @param {JOptEdgeConnection} c
   * @return {*}  {boolean}
   * @memberof LoadExampleDataService
   */
  private isDesiredConnectionsMember(
    ids: string[],
    c: JOptEdgeConnection
  ): boolean {
    if (c.fromId === c.toId) {
      return false;
    }

    return ids.indexOf(c.fromId) > -1 && ids.indexOf(c.toId) > -1;
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
   * @return {*}  {Promise<JOptEdgeConnection[]>}
   * @memberof LoadExampleDataService
   */
  loadGeoConnections(path: string): Promise<JOptEdgeConnection[]> {
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
   * @return {*}  {Promise<JOptOptimizationInput>}
   * @memberof LoadExampleDataService
   */
  loadOptimizationInput(path: string): Promise<JOptOptimizationInput> {
    return new Promise((resolve) => {
      this.http.get(path).subscribe((data: JOptOptimizationInput) => {
        this.defaultOptimizationInput = data;
        resolve(data);
      });
    });
  }
}
