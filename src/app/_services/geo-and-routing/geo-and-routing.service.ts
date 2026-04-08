import { Injectable } from '@angular/core';
import { OptimizationWrapperService } from '../optimization-wrapper/optimization-wrapper.service';
import { LoadExampleDataService } from '../load-example-data/load-example-data.service';
import { MapViewDefinition } from '../leaflet-map/interface/map-view-defintion';
import { GeoNode, Position, RestOptimization } from '@openapibuild/openapi';

/**
 * Service responsible for extracting and generating geographic route shapes between elements.
 *
 * This service provides the geographic data needed to draw route polylines on the Leaflet map.
 * It attempts to find pre-computed route shapes (encoded polylines from a routing engine such
 * as Valhalla) for each pair of elements. When a pre-computed shape is not available, it
 * generates a straight-line fallback between the two element positions.
 *
 * It also provides access to map view configuration and delegates to the example data service
 * for determining whether the current example supports draggable markers.
 *
 * @export
 * @class GeoAndRoutingService
 */
@Injectable({
  providedIn: 'root',
})
export class GeoAndRoutingService {
  /**
   * Creates an instance of GeoAndRoutingService.
   *
   * @param {LoadExampleDataService} dataSerive - Service providing pre-loaded example data including route shapes.
   * @param {OptimizationWrapperService} optiWrapper - Service providing access to current nodes and resources for position lookups.
   * @memberof GeoAndRoutingService
   */
  constructor(
    private dataSerive: LoadExampleDataService,
    private optiWrapper: OptimizationWrapperService
  ) {}

  /**
   * Decodes a route shape
   *
   * @see https://valhalla.readthedocs.io/en/latest/decoding/
   *
   * @static
   * @param {string} str
   * @param {number} precision
   * @return {*}  {number[]}
   * @memberof GeoAndRoutingService
   */
  static decode(str: string, precision: number): number[] {
    let index = 0;
    let lat = 0;
    let lng = 0;
    const coordinates = [];
    let shift = 0;
    let result = 0;
    let byte = null;
    let latitude_change;
    let longitude_change;
    let factor = Math.pow(10, precision || 6);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {
      // Reset shift, result, and byte
      byte = null;
      shift = 0;
      result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      latitude_change = result & 1 ? ~(result >> 1) : result >> 1;

      shift = result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      longitude_change = result & 1 ? ~(result >> 1) : result >> 1;

      lat += latitude_change;
      lng += longitude_change;

      coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
  }

  /**
   * Returns the map view definition (center coordinates, zoom level) for the current example.
   *
   * Delegates to the {@link LoadExampleDataService}.
   *
   * @returns {MapViewDefinition} The map view configuration for the Leaflet map.
   * @memberof GeoAndRoutingService
   */
  public mapViewDef(): MapViewDefinition {
    return this.dataSerive.mapViewDef();
  }

  /**
   * Checks whether the current example supports draggable resource markers on the map.
   *
   * @returns {boolean} True if resources can be repositioned via drag-and-drop.
   * @memberof GeoAndRoutingService
   */
  public exampleHasDraggableResource() : boolean {
    return this.dataSerive.curExampleHasMovableResources();
  }

    /**
     * Checks whether the current example supports draggable node markers on the map.
     *
     * @returns {boolean} True if nodes can be repositioned via drag-and-drop.
     * @memberof GeoAndRoutingService
     */
    public exampleHasDraggableNode() : boolean {
      return this.dataSerive.curExampleHasMovableNodes();;
    }

  /**
   * Creates the route shape (polyline coordinates) between two elements.
   *
   * First attempts to find a pre-computed route shape from the loaded example data.
   * If found, the encoded polyline is decoded and returned. If no pre-computed shape
   * exists, a straight-line fallback is generated using the geographic positions of
   * the two elements.
   *
   * For Event nodes (which lack a fixed position), the method attempts to resolve
   * the effective position from the optimization result. If no position can be
   * determined, a fallback position of (0, 0) is used.
   *
   * @param {string} elementIdFrom - The ID of the starting element (node or resource).
   * @param {string} elementIdTo - The ID of the destination element (node or resource).
   * @param {RestOptimization} [result] - Optional optimization result used to resolve Event node positions.
   * @returns {number[]} Array of [latitude, longitude] coordinate pairs forming the route shape.
   * @memberof GeoAndRoutingService
   */
  public getSingleRouteShape(
    elementIdFrom: string,
    elementIdTo: string,
    result?: RestOptimization
  ): number[] {
    const c = this.getRouteConnection(
      elementIdFrom,
      elementIdTo,
      this.dataSerive.routes()
    );

    if (c !== undefined) {
      return this.extractShape(c);
    }

    // We try to look up the shape if it can't be found we simply do a direct polyline
    const coordinates = [];

    let fromPosition: Position;
    let toPosition: Position;

    // Fallback
    const elemenFrom = this.optiWrapper.node(elementIdFrom);
    const elemenTo = this.optiWrapper.node(elementIdTo);

    if (elemenFrom !== undefined) {
      if (elemenFrom.type.typeName === "Geo") {
        fromPosition = (elemenFrom.type as GeoNode).position;
      }
    } else {
      const elemenFromAsRes = this.optiWrapper.resource(elementIdFrom);

      if (elemenFromAsRes !== undefined) {
        fromPosition = elemenFromAsRes.position;
      }
    }

    if (elemenTo !== undefined) {
      if (elemenTo.type.typeName === "Geo") {
        toPosition = (elemenTo.type as GeoNode).position;
      }
    } else {
      const elemenToAsRes = this.optiWrapper.resource(elementIdTo);

      if (elemenToAsRes !== undefined) {
        toPosition = elemenToAsRes.position;
      }
    }


    // Use details for events if possible
           
    let fallbackPos:Position = {latitude:0.0, longitude:0.0};

    if(fromPosition == undefined){
      
      if(result !== undefined){

        // Check if we can get it from effective positon
        let curDetail = OptimizationWrapperService.nodeResult(
          elemenFrom.id,
          result
        );

        if(curDetail!== undefined){
          const lat = curDetail.effectivePosition.latitude;
          const lon = curDetail.effectivePosition.longitude;
          fromPosition = {latitude:lat, longitude:lon};
        }else{
          fromPosition =  fallbackPos;
        }

      }else{
        // Fallback
        fromPosition = fallbackPos;
      }
    }

    if(toPosition == undefined){
      if(result !== undefined){
        
        // Check if we can get it from effective positon
        let curDetail = OptimizationWrapperService.nodeResult(
          elemenTo.id,
          result
        );

        if(curDetail!== undefined){
          const lat = curDetail.effectivePosition.latitude;
          const lon = curDetail.effectivePosition.longitude;
          toPosition = {latitude:lat, longitude:lon};
        }else{
          toPosition =  fallbackPos;
        }

      }else{
        // Fallback
        toPosition = fallbackPos;
      }
    }

    coordinates.push([fromPosition.latitude, fromPosition.longitude]);
    coordinates.push([toPosition.latitude, toPosition.longitude]);
    return coordinates;
  }

  /**
   * Finds a pre-computed route connection object matching the given from/to element pair.
   *
   * @param {string} fromId - The ID of the starting element.
   * @param {string} toId - The ID of the destination element.
   * @param {object[]} routeConnections - The array of all pre-computed route connections to search.
   * @returns {object} The matching route connection, or undefined if not found.
   * @memberof GeoAndRoutingService
   */
  getRouteConnection(
    fromId: string,
    toId: string,
    routeConnections: object[]
  ): object {
    return routeConnections.find((c) =>
      this.isDesiredConnection(fromId, toId, c)
    );
  }

  /**
   * Checks whether a route connection matches the specified from/to element ID pair.
   *
   * @param {string} fromId - The expected source element ID.
   * @param {string} toId - The expected destination element ID.
   * @param {object} routeConnection - The route connection object to check.
   * @returns {boolean} True if the connection matches the from/to pair exactly.
   * @memberof GeoAndRoutingService
   */
  isDesiredConnection(
    fromId: string,
    toId: string,
    routeConnection: object
  ): boolean {
    if (
      this.getFromId(routeConnection) === fromId &&
      this.getToId(routeConnection) === toId
    ) {
      return true;
    }

    return false;
  }

  /**
   * Extracts the source element ID from a route connection object.
   *
   * @param {object} routeConnection - The route connection object.
   * @returns {string} The "fromId" property value.
   * @memberof GeoAndRoutingService
   */
  getFromId(routeConnection: object): string {
    return routeConnection['fromId'];
  }

  /**
   * Extracts the destination element ID from a route connection object.
   *
   * @param {object} routeConnection - The route connection object.
   * @returns {string} The "toId" property value.
   * @memberof GeoAndRoutingService
   */
  getToId(routeConnection: object): string {
    return routeConnection['toId'];
  }

  /**
   * Extracts and decodes the encoded polyline shape from a route connection object.
   *
   * The route connection is expected to have a Valhalla-style structure:
   * `{ trip: { legs: [{ shape: "encodedPolylineString" }] } }`.
   * The first leg's shape is decoded using the {@link decode} method with precision 6.
   *
   * @param {object} routeConnection - The route connection object containing the encoded shape.
   * @returns {number[]} Array of decoded [latitude, longitude] coordinate pairs.
   * @memberof GeoAndRoutingService
   */
  extractShape(routeConnection: object): number[] {
    const trip = routeConnection['trip'];
    const legs = trip['legs'];
    const firstLeg = legs[0];
    const shape = firstLeg['shape'];

    return GeoAndRoutingService.decode(shape, 6);
  }
}
