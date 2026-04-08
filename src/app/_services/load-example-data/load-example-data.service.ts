import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestOptimization, ElementConnection } from '@openapibuild/openapi';

import { environment } from '@env/environment';
import { JOptExampleDefinition } from './interface/jopt-example-defintion';
import { MapViewDefinition } from '../leaflet-map/interface/map-view-defintion';

/**
 * Service responsible for loading predefined example datasets from local JSON assets.
 *
 * This service is central to the demo application's data pipeline. It loads example
 * optimization inputs (nodes, resources), pre-computed distance/time matrices,
 * geographic route shapes, and map view configurations from JSON files stored in
 * the application's assets directory.
 *
 * The loaded data is then made available to other services (such as
 * {@link OptimizationWrapperService} and {@link GeoAndRoutingService}) that consume
 * it for optimization and map rendering.
 *
 * Multiple examples are supported and can be switched at runtime by calling
 * {@link loadExample} with different example IDs.
 *
 * @export
 * @class LoadExampleDataService
 */
@Injectable({
  providedIn: 'root',
})
export class LoadExampleDataService {
  /** The ID of the example that is loaded by default on application startup. */
  defaultExampleId = 'exampleOne';

  // TODO load via json - like mapviewproperties
  /** List of example IDs where resources (vehicles) can be repositioned via drag-and-drop on the map. */
  exampleWithMovableResources: string[] = ["exampleFive","exampleSix"];
  /** List of example IDs where nodes (customer locations) can be repositioned via drag-and-drop on the map. */
  exampleWithMovableNodes: string[] = ["exampleFive","exampleSix"];

  /** Array of all available example definitions loaded from the helper JSON file. */
  private exampleDefs: JOptExampleDefinition[];

  /** The currently active example definition. */
  private curDef: JOptExampleDefinition;
  /** The parsed optimization input (nodes, resources, settings) for the current example. */
  private defaultOptimizationInput: RestOptimization = null;
  /** Pre-computed distance/time connections between elements for the current example. */
  private geoConnections: ElementConnection[];
  /** Pre-computed geographic route shapes (encoded polylines) for the current example. */
  private geoRoutes: object[];
  /** Map view configuration (center coordinates, zoom level) for the current example. */
  private mapViewDefintion: MapViewDefinition;

  /**
   * Creates an instance of LoadExampleDataService.
   *
   * @param {HttpClient} http - Angular's HTTP client used to fetch JSON asset files.
   * @memberof LoadExampleDataService
   */
  constructor(private http: HttpClient) {}

  /**
   * The extracted Example Input
   *
   * @return {*}  {RestOptimization}
   * @memberof LoadExampleDataService
   */
  public optimizationInput(): RestOptimization {
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
   * Determines whether a connection belongs to the desired set of element IDs.
   *
   * A connection is included only if both its fromElementId and toElementId are
   * present in the provided ID list, and the connection is not a self-loop.
   *
   * @private
   * @param {string[]} ids - The list of element IDs to filter by.
   * @param {ElementConnection} c - The connection to evaluate.
   * @returns {boolean} True if the connection connects two distinct elements within the ID list.
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
   * Returns the pre-computed geographic route shapes for the current example.
   *
   * Route shapes contain encoded polyline data representing the actual road paths
   * between elements, used to draw realistic route lines on the map.
   *
   * @returns {object[]} Array of route shape objects containing encoded polyline data.
   * @memberof LoadExampleDataService
   */
  public routes(): object[] {
    return this.geoRoutes;
  }

  /**
   * Returns the map view configuration for the current example.
   *
   * Contains the initial center coordinates and zoom level for the Leaflet map.
   *
   * @returns {MapViewDefinition} The map view definition with center and zoom properties.
   * @memberof LoadExampleDataService
   */
  public mapViewDef(): MapViewDefinition {
    return this.mapViewDefintion;
  }

  /**
   * Returns all available example definitions.
   *
   * Each definition contains paths to the JSON asset files for an example scenario.
   *
   * @returns {JOptExampleDefinition[]} Array of all loaded example definitions.
   * @memberof LoadExampleDataService
   */
  public getExampledDefs(): JOptExampleDefinition[] {
    return this.exampleDefs;
  }

  /**
   * Finds an example definition by its unique example ID.
   *
   * @private
   * @param {string} exampleId - The unique identifier of the example to find.
   * @returns {JOptExampleDefinition} The matching example definition.
   * @memberof LoadExampleDataService
   */
  private getExampleDef(exampleId: string): JOptExampleDefinition {
    return this.exampleDefs.find((d) => d.exampleId === exampleId);
  }

  // Loaders

  /**
   * Loads the default example dataset (identified by {@link defaultExampleId}).
   *
   * This is typically called during application initialization via the APP_INITIALIZER token.
   *
   * @returns {Promise<unknown>} A promise that resolves when all example data has been loaded.
   * @memberof LoadExampleDataService
   */
  public loadDefaultExample(): Promise<unknown> {
    return this.loadExample(this.defaultExampleId);
  }

  /**
   * Returns the default example ID string.
   *
   * @returns {string} The default example identifier (e.g., "exampleOne").
   * @memberof LoadExampleDataService
   */
  public getDefaultExampleId(){
    return this.defaultExampleId;
  }


  /**
   * Checks whether the currently loaded example supports draggable nodes on the map.
   *
   * @returns {boolean} True if the current example allows nodes to be repositioned by dragging.
   * @memberof LoadExampleDataService
   */
  public curExampleHasMovableNodes(): boolean {
    if(this.curDef != undefined){
      return this.exampleWithMovableNodes.includes(this.curDef.exampleId);
    }
    return false;
  }

  /**
   * Checks whether the currently loaded example supports draggable resources on the map.
   *
   * @returns {boolean} True if the current example allows resources to be repositioned by dragging.
   * @memberof LoadExampleDataService
   */
  public curExampleHasMovableResources(): boolean {
    if(this.curDef != undefined){
      return this.exampleWithMovableResources.includes(this.curDef.exampleId);
    }
    return false;
  }


  /**
   * Loads a complete example dataset by its ID.
   *
   * This method orchestrates the sequential loading of all required JSON assets for
   * an example: the example helper definitions, optimization input, distance/time
   * matrix connections, geographic route shapes, and map view properties.
   *
   * @param {string} exampleId - The unique identifier of the example to load (e.g., "exampleOne").
   * @returns {Promise<unknown>} A promise that resolves when all data for the example has been loaded.
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
   * Loads the example helper JSON file that contains definitions for all available examples.
   *
   * Each definition includes file paths to the optimization input, matrix, routes,
   * and map view properties for that example.
   *
   * @param {string} path - The path to the example helper JSON asset file.
   * @returns {Promise<JOptExampleDefinition[]>} A promise that resolves with the array of example definitions.
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
   * Loads pre-computed distance/time connections (the element connection matrix) from a JSON file.
   *
   * These connections provide travel time and distance data between pairs of elements,
   * which are sent to the optimizer as part of the optimization input.
   *
   * @param {string} path - The path to the connections JSON asset file.
   * @returns {Promise<ElementConnection[]>} A promise that resolves with the array of element connections.
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
   * Loads pre-computed geographic route shapes from a JSON file.
   *
   * Route shapes contain encoded polyline data (Valhalla format) representing the
   * actual road paths between elements, used for drawing realistic route lines on the map.
   *
   * @param {string} path - The path to the routes JSON asset file.
   * @returns {Promise<any>} A promise that resolves with the array of route shape objects.
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
   * Loads the map view definition (center coordinates, zoom level) from a JSON file.
   *
   * This configuration determines how the Leaflet map is initially positioned when
   * displaying a particular example.
   *
   * @param {string} path - The path to the map view properties JSON asset file.
   * @returns {Promise<MapViewDefinition>} A promise that resolves with the map view definition.
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
   * Loads the optimization input data (nodes, resources, and settings) from a JSON file.
   *
   * This is the main payload that defines what will be optimized: the set of customer
   * nodes to visit, the available resources (vehicles/drivers), and any optimization settings.
   *
   * @param {string} path - The path to the optimization input JSON asset file.
   * @returns {Promise<RestOptimization>} A promise that resolves with the parsed optimization input.
   * @memberof LoadExampleDataService
   */
  loadOptimizationInput(path: string): Promise<RestOptimization> {
    return new Promise((resolve) => {
      this.http.get(path).subscribe((data: RestOptimization) => {
        this.defaultOptimizationInput = data;
        resolve(data);
      });
    });
  }
}
