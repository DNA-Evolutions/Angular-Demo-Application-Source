import { Injectable, ElementRef } from '@angular/core';
import { Route, RestOptimization } from '@openapibuild/openapi';
import * as L from 'leaflet';
import { GeoAndRoutingService } from '../../geo-and-routing/geo-and-routing.service';
import { PopUpService } from '../pop-up/leaflet-popup.service';

/**
 * Service responsible for drawing route polylines (colored lines) between markers on the Leaflet map.
 *
 * After an optimization run completes, this service takes the resulting routes and draws
 * polyline paths on the map connecting the elements in each route's visit order. It uses
 * the {@link GeoAndRoutingService} to obtain route shapes (either pre-computed encoded
 * polylines or straight-line fallbacks) and assigns a unique color to each route for
 * visual distinction.
 *
 * Each polyline segment is interactive -- clicking it opens a route result dialog via
 * the {@link PopUpService}.
 *
 * @export
 * @class LeafletPolylineService
 */
@Injectable({
  providedIn: 'root',
})
export class LeafletPolylineService {
  /**
   * Creates an instance of LeafletPolylineService.
   *
   * @param {GeoAndRoutingService} geoService - Provides route shape data for drawing polylines.
   * @param {PopUpService} popupService - Handles binding popups and tooltips to polylines.
   * @memberof LeafletPolylineService
   */
  constructor(
    private geoService: GeoAndRoutingService,
    private popupService: PopUpService
  ) {}


  /**
   * Draws polylines on the map for all segments of a single optimization result route.
   *
   * Assembles the ordered list of element IDs for the route (start element, visited nodes,
   * end element) and delegates to {@link drawMutliElementPolyine} to draw the actual
   * line segments. If the route has no element details, no polylines are drawn.
   *
   * @param {Route} route - The optimization result route containing element details and start/end IDs.
   * @param {number} index - The zero-based route index, used for color assignment.
   * @param {ElementRef} ref - The Angular element reference of the map component.
   * @param {*} map - The Leaflet map instance to draw on.
   * @param {RestOptimization} [result] - Optional full optimization result for resolving Event node positions.
   * @memberof LeafletPolylineService
   */
  public drawRouteResultPolyline(
    route: Route,
    index: number,
    ref: ElementRef,
    map: any,
    result?: RestOptimization
  ): void {
    if (route.elementDetails.length === 0) {
      return;
    }

    const ids = Array<string>();
    ids.push(route.startElementId);
    route.elementDetails.map((d) => d.elementId).forEach((id) => ids.push(id));
    ids.push(route.endElementId);

    this.drawMutliElementPolyine(ids, route, index, ref, map, result);
  }

  /**
   * Draws polyline segments between consecutive pairs of elements in a route.
   *
   * For a route visiting elements [A, B, C, D], this method draws segments:
   * A->B, B->C, C->D. Each segment uses the route shape from the
   * {@link GeoAndRoutingService} and is styled with a color determined by the route index.
   *
   * Handles both closed routes (where the last element returns to start) and open routes
   * (where the route ends at the last visited node).
   *
   * @private
   * @param {Array<string>} ids - Ordered array of element IDs defining the route path.
   * @param {Route} route - The route object (used for popup binding).
   * @param {number} index - The zero-based route index for color assignment.
   * @param {ElementRef} ref - The Angular element reference for popup binding.
   * @param {*} map - The Leaflet map instance to draw on.
   * @param {RestOptimization} [result] - Optional optimization result for resolving Event node positions.
   * @memberof LeafletPolylineService
   */
  private drawMutliElementPolyine(
    ids: Array<string>,
    route: Route,
    index: number,
    ref: ElementRef,
    map: any,
    result?: RestOptimization
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
      shapes.push(this.geoService.getSingleRouteShape(ids[ii], ids[ii + 1], result));
    }

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

  /**
   * Returns a CSS hex color string for a route based on its index.
   *
   * Uses a predefined palette of 10 visually distinct colors. Route indices greater
   * than 9 wrap around using modulo arithmetic, so colors repeat for large numbers
   * of routes.
   *
   * Color palette:
   * 0: Royal Blue, 1: Orange Red, 2: Dark Violet, 3: Turquoise,
   * 4: Sandy Brown, 5: Slate Gray, 6: Purple, 7: Dark Magenta,
   * 8: Papaya Whip, 9: Royal Blue.
   *
   * @private
   * @param {number} ii - The zero-based route index.
   * @returns {string} A CSS hex color string (e.g., "#4169E1").
   * @memberof LeafletPolylineService
   */
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
