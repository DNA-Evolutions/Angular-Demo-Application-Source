import * as L from 'leaflet';

export const getCurrentOffset = (map: any): {x: number, y: number} => {

  const layerCorner: L.Point = map.getPixelOrigin();
  const mapCorner: L.Point   = map.getPixelBounds().min;

  let xVal = 0;
  let yVal = 0;

  if (!layerCorner.equals(mapCorner)) {
    xVal = layerCorner.x - mapCorner.x;
    yVal = layerCorner.y - mapCorner.y;
  }

  return {x: xVal, y: yVal};
};

