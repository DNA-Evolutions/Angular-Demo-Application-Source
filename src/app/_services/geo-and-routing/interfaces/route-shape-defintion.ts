export interface RouteShapeDefinition {
  routeId: string;
  nodeFromId: string;
  nodeFronLatLon: Array<number>;
  nodeToId: string;
  nodeToLatLon: Array<number>;
  shape: string;
}
