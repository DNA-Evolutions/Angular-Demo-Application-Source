import { Injectable, ElementRef } from '@angular/core';
import { GeoNode, NodeType } from '@openapibuild/openapi';
import * as L from 'leaflet';
import { OptimizationWrapperService } from '../../optimization-wrapper/optimization-wrapper.service';
import { PopUpService } from '../pop-up/leaflet-popup.service';

/**
 * Service that is providing the functionality to add markers to the leaflet map
 *
 * @export
 * @class LeafletMarkerService
 */
@Injectable({
  providedIn: 'root',
})
export class LeafletMarkerService {
  constructor(
    private dataService: OptimizationWrapperService,
    private popupService: PopUpService
  ) {}

  /**
   * Adding Nodes to the map
   *
   * @param {L.map} map
   * @param {ElementRef} ref
   * @param {*} icon
   * @memberof LeafletMarkerService
   */
  markNodes(map: L.map, ref: ElementRef, icon: any, isDraggable: boolean): void {
    // Get nodes
    this.dataService.nodes().forEach((n) => {
      const lat = (n.type as GeoNode).position.latitude;
      const lon = (n.type as GeoNode).position.longitude;
      const marker = L.marker([lat, lon], { icon, draggable: isDraggable });

      this.popupService.bindNodePopUp(marker, n, ref, isDraggable);

      marker.addTo(map);
      // }
    });
  }

  /**
   * Adding Resources to the map
   *
   * @param {L.map} map
   * @param {ElementRef} ref
   * @param {*} icon
   * @memberof LeafletMarkerService
   */
  markResources(map: L.map, ref: ElementRef, icon: any, isDraggable: boolean): void {
    // Get nodes
    this.dataService.resources().forEach((r) => {
      const lat = r.position.latitude;
      const lon = r.position.longitude;

      const marker = L.marker([lat, lon], { icon, draggable: isDraggable  });

      this.popupService.bindResourcePopUp(marker, r, ref, isDraggable);
      marker.addTo(map);
    });
  }
}
