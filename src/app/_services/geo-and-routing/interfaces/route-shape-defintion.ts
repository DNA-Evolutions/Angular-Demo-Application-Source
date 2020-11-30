/**
 * Used to draw the route shape on the leaflet map
 *
 * @export
 * @interface RouteShapeDefinition
 */
export interface RouteShapeDefinition {
  routeId: string;
  nodeFromId: string;
  nodeFronLatLon: Array<number>;
  nodeToId: string;
  nodeToLatLon: Array<number>;
  shape: string;
}
