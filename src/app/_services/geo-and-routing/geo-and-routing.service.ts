import { Injectable } from '@angular/core';
import { OptimizationWrapperService } from '../optimization-wrapper/optimization-wrapper.service';
import { LoadExampleDataService } from '../load-example-data/load-example-data.service';
import { MapViewDefinition } from '../leaflet-map/interface/map-view-defintion';
import { JOptGeoPosition } from 'build/openapi';

/**
 * Service that is providing functionality to extract connection shapes
 * between elements. In case a connection is not found, a straight connection
 * shap is generated.
 *
 * @export
 * @class GeoAndRoutingService
 */
@Injectable({
  providedIn: 'root',
})
export class GeoAndRoutingService {
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
   *
   * @return {*}  {MapViewDefinition}
   * @memberof GeoAndRoutingService
   */
  public mapViewDef(): MapViewDefinition {
    return this.dataSerive.mapViewDef();
  }

  /**
   *
   * Creates the route shape line. Either by decoding an existing (extracted) route shape, or
   * by creating a straight line, if no route shape is provided/found.
   *
   * @param {string} elementIdFrom
   * @param {string} elementIdTo
   * @return {*}  {number[]}
   * @memberof GeoAndRoutingService
   */
  public getSingleRouteShape(
    elementIdFrom: string,
    elementIdTo: string
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

    let fromPosition: JOptGeoPosition;
    let toPosition: JOptGeoPosition;

    // Fallback
    const elemenFrom = this.optiWrapper.node(elementIdFrom);
    const elemenTo = this.optiWrapper.node(elementIdTo);

    if (elemenFrom !== undefined) {
      fromPosition = elemenFrom.position;
    } else {
      const elemenFromAsRes = this.optiWrapper.resource(elementIdFrom);

      if (elemenFromAsRes !== undefined) {
        fromPosition = elemenFromAsRes.position;
      }
    }

    if (elemenTo !== undefined) {
      toPosition = elemenTo.position;
    } else {
      const elemenToAsRes = this.optiWrapper.resource(elementIdTo);

      if (elemenToAsRes !== undefined) {
        toPosition = elemenToAsRes.position;
      }
    }

    coordinates.push([
      fromPosition.geoCoordinate.latitude,
      fromPosition.geoCoordinate.longitude,
    ]);
    coordinates.push([
      toPosition.geoCoordinate.latitude,
      toPosition.geoCoordinate.longitude,
    ]);
    return coordinates;
  }

  /**
   *
   *
   * @param {string} fromId
   * @param {string} toId
   * @param {object[]} routeConnections
   * @return {*}  {object}
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
   *
   *
   * @param {string} fromId
   * @param {string} toId
   * @param {object} routeConnection
   * @return {*}  {boolean}
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
   *
   *
   * @param {object} routeConnection
   * @return {*}  {string}
   * @memberof GeoAndRoutingService
   */
  getFromId(routeConnection: object): string {
    return routeConnection['fromId'];
  }

  /**
   *
   *
   * @param {object} routeConnection
   * @return {*}  {string}
   * @memberof GeoAndRoutingService
   */
  getToId(routeConnection: object): string {
    return routeConnection['toId'];
  }

  /**
   *
   *
   * @param {object} routeConnection
   * @return {*}  {number[]}
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
