import { Injectable, ElementRef } from '@angular/core';
import { GeoNode, EventNode, NodeType, RestOptimization } from '@openapibuild/openapi';
import * as L from 'leaflet';
import { OptimizationWrapperService } from '../../optimization-wrapper/optimization-wrapper.service';
import { PopUpService } from '../pop-up/leaflet-popup.service';
import { LeafletMapComponent } from 'src/app/component/leaflet-map/leaflet-map.component';

/**
 * Service responsible for creating and placing Leaflet markers on the map for nodes and resources.
 *
 * This service iterates over the current optimization input data (nodes and resources) from
 * the {@link OptimizationWrapperService} and creates Leaflet map markers at each element's
 * geographic position. It handles different node types (Geo, Event, Pillar) with appropriate
 * icons and configures popup/tooltip interactions via the {@link PopUpService}.
 *
 * Markers can optionally be made draggable, allowing users to reposition elements on the map
 * in supported examples.
 *
 * @export
 * @class LeafletMarkerService
 */
@Injectable({
  providedIn: 'root',
})
export class LeafletMarkerService {
  /**
   * Creates an instance of LeafletMarkerService.
   *
   * @param {OptimizationWrapperService} dataService - Provides access to the current nodes and resources.
   * @param {PopUpService} popupService - Handles binding popups and tooltips to markers.
   * @memberof LeafletMarkerService
   */
  constructor(
    private dataService: OptimizationWrapperService,
    private popupService: PopUpService
  ) { }

  /**
   * Creates and adds markers for all nodes to the Leaflet map.
   *
   * Iterates over all nodes in the current optimization input and creates a marker
   * for each one at its geographic position. Different icons are used depending on the
   * node type:
   * - **Geo nodes**: Standard customer location markers (or pillar markers if flagged as pillar nodes).
   * - **Event nodes**: Placed at their effective position from the optimization result (if available).
   *
   * Each marker is bound to a popup/tooltip for interaction and optionally made draggable.
   * The method also updates the component's event node flag based on whether any Event
   * nodes were found.
   *
   * @param {LeafletMapComponent} comp - The map component providing access to the Leaflet map and element ref.
   * @param {*} iconNode - The Leaflet icon to use for standard Geo nodes.
   * @param {*} iconEvent - The Leaflet icon to use for Event nodes.
   * @param {*} iconPillar - The Leaflet icon to use for Pillar nodes (mandatory waypoints).
   * @param {boolean} isDraggable - Whether the markers should be draggable by the user.
   * @param {RestOptimization} [result] - Optional optimization result used to resolve Event node positions.
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
   * Creates and adds markers for all resources (vehicles/drivers) to the Leaflet map.
   *
   * Iterates over all resources in the current optimization input and creates a marker
   * at each resource's home/depot position. Each marker is bound to a popup/tooltip
   * and optionally made draggable.
   *
   * @param {L.Map} map - The Leaflet map instance to add markers to.
   * @param {ElementRef} ref - The Angular element reference of the map component (used for popup binding).
   * @param {*} icon - The Leaflet icon to use for resource markers.
   * @param {boolean} isDraggable - Whether the markers should be draggable by the user.
   * @memberof LeafletMarkerService
   */
  markResources(map: L.Map, ref: ElementRef, icon: any, isDraggable: boolean): void {
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
