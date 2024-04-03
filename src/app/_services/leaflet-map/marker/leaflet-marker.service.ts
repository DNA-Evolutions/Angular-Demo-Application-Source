import { Injectable, ElementRef } from '@angular/core';
import { GeoNode, EventNode, NodeType, RestOptimization } from '@openapibuild/openapi';
import * as L from 'leaflet';
import { OptimizationWrapperService } from '../../optimization-wrapper/optimization-wrapper.service';
import { PopUpService } from '../pop-up/leaflet-popup.service';
import { LeafletMapComponent } from 'src/app/component/leaflet-map/leaflet-map.component';

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
  ) { }

  /**
   * Adding Nodes to the map
   *
   * @param {L.map} map
   * @param {ElementRef} ref
   * @param {*} icon
   * @memberof LeafletMarkerService
   */
  markNodes(comp: LeafletMapComponent, iconNode: any, iconEvent: any, iconPillar: any, isDraggable: boolean, result?: RestOptimization): void {


    let map = comp.getMap();
    let ref = comp.getElementRef();

    let foundEvents = false;

    // Get nodes
    this.dataService.nodes().forEach((n) => {

      // Check if position is present

      if (n.type.typeName === 'Geo') {

        const lat = (n.type as GeoNode).position.latitude;
        const lon = (n.type as GeoNode).position.longitude;

        let marker;

        if ((n.type as GeoNode).pillarNode == undefined) {
          marker = L.marker([lat, lon], { icon: iconNode, draggable: isDraggable });
        } else {
          marker = L.marker([lat, lon], { icon: iconPillar, draggable: isDraggable });
        }

        this.popupService.bindNodePopUp(marker, n, ref, isDraggable);

        marker.addTo(map);
      }

      if (n.type.typeName === 'Event') {


        foundEvents = true;

        let marker;

        let hasResult = result !== undefined;

        if (hasResult) {

          let curDetail = OptimizationWrapperService.nodeResult(
            n.id,
            result
          );

          if (curDetail !== undefined) {
            const lat = curDetail.effectivePosition.latitude;
            const lon = curDetail.effectivePosition.longitude;
            marker = L.marker([lat, lon], { icon: iconEvent, draggable: false });

            this.popupService.bindNodePopUp(marker, n, ref, false);
            marker.addTo(map);

          }
        }


      }

    });

    if (foundEvents) {
      comp.setHasEventNodes(true);
    } else {
      // Set to false, if another example without events is loaded, we want to deactivated the event button
      comp.setHasEventNodes(false);
    }
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

      const marker = L.marker([lat, lon], { icon: icon, draggable: isDraggable });

      this.popupService.bindResourcePopUp(marker, r, ref, isDraggable);
      marker.addTo(map);
    });
  }
}
