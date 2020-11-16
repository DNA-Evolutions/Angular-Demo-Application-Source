import { Injectable, ElementRef } from '@angular/core';
import { JOptRoute } from 'build/openapi';
import * as L from 'leaflet';
import { GeoAndRoutingService } from '../../geo-and-routing/geo-and-routing.service';
import { PopUpService } from '../pop-up/leaflet-popup.service';

@Injectable({
  providedIn: 'root',
})
export class LeafletPolylineService {
  constructor(
    private geoService: GeoAndRoutingService,
    private popupService: PopUpService
  ) {}

  public drawRouteResultPolyline(
    route: JOptRoute,
    index: number,
    ref: ElementRef,
    map: any
  ): void {
    if (route.elementDetails.length === 0) {
      return;
    }

    const ids = Array<string>();
    ids.push(route.startElementId);
    route.elementDetails.map((d) => d.id).forEach((id) => ids.push(id));
    ids.push(route.endElementId);

    //console.log(ids);
    this.drawMutliElementPolyine(ids, route, index, ref, map);
  }

  private drawMutliElementPolyine(
    ids: Array<string>,
    route: JOptRoute,
    index: number,
    ref: ElementRef,
    map: any
  ): void {
    // ids descibes the route:
    // Case 1 - Closed Route :E.g. Jack => Koeln => Duisburg => Jack
    // Case 2 - Open   Route :E.g. Jack => Koeln => Duisburg

    // Case 1: We extend the string array to be
    // Jack => Koeln, Koeln => Duisburg, Duisburg => Jack

    // Case 2: We extend the string array to be
    // Jack => Koeln, Koeln => Duisburg

    // In conclusion: The first and last element of ids does not get duplicated
    // All other elements do

    // const idsForCorrdinates = [];

    const numIds = ids.length;

    const shapes = [[]];
    // Now transfrom to shapes
    for (let ii = 0; ii < numIds - 1; ii++) {
      shapes.push(this.geoService.getSingleRouteShape(ids[ii], ids[ii + 1]));
    }

    //console.log(shapes);
    for (let ii = 0; ii < shapes.length; ii++) {
      const ployline = L.polyline(shapes[ii], {
        color: this.getColor(index),
        smoothFactor: 1,
        opacity: 0.6,
        weight: 5,
      });

      this.popupService.bindPolyRoutePopUp(ployline, route, ref);
      ployline.addTo(map);
    }
  }

  private getColor(ii: number): string {
    if (ii > 9) {
      ii = ii % 10;
    }

    if (ii === 0) {
      return '#4169E1'; // royal blue
    }

    if (ii === 1) {
      return '#FF4500'; // 	orange red
    }

    if (ii === 2) {
      return '#9400D3'; // 		dark violet
    }

    if (ii === 6) {
      return '#800080'; // 		purple
    }

    if (ii === 4) {
      return '#F4A460'; // 		 sandy brown
    }

    if (ii === 5) {
      return '#708090'; // 		 slate gray
    }

    if (ii === 3) {
      return '#40E0D0'; // 		 	turquoise
    }

    if (ii === 7) {
      return '#8B008B'; // 		 	dark magenta
    }

    if (ii === 8) {
      return '#FFEFD5'; // 		 	papaya whip
    }

    if (ii === 9) {
      return '#4169E1'; // 		 	royal blue
    }

    return 'red';
  }
}
