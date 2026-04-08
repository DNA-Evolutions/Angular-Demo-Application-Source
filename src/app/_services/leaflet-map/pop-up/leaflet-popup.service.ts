import { Injectable, ElementRef } from '@angular/core';
import { GeoNode, Resource, Route, Node } from '@openapibuild/openapi';
import { MatDialog } from '@angular/material/dialog';
import { NodePropertiesDialogComponent } from 'src/app/component/optimization-elements/node/node-properties-dialog.component';
import { ResourcePropertiesDialogComponent } from 'src/app/component/optimization-elements/resource/resource-properties-dialog.component';
import * as L from 'leaflet';
import { RouteResultDialogComponent } from 'src/app/component/optimization-elements/result/route/route-result/route-result-dialog.component';
import { OptimizationWrapperService } from '../../optimization-wrapper/optimization-wrapper.service';

/**
 * Service responsible for creating and binding Leaflet popups, tooltips, and Angular Material
 * dialogs to map markers and polylines.
 *
 * This service bridges the Leaflet map layer with Angular Material dialogs. When a user
 * interacts with a marker or polyline on the map (click, drag), this service:
 * - Binds informational popups and tooltips showing element details.
 * - Opens Angular Material dialog components for detailed viewing and editing of
 *   node properties, resource properties, and route results.
 * - Handles drag-end events to update element positions in the optimization input.
 *
 * @export
 * @class PopUpService
 */
@Injectable({
  providedIn: 'root',
})
export class PopUpService {
  /**
   * Creates an instance of PopUpService.
   *
   * @param {OptimizationWrapperService} dataService - Used to update element positions when markers are dragged.
   * @param {MatDialog} dialog - Angular Material dialog service for opening property/result dialogs.
   * @memberof PopUpService
   */
  constructor(
    private dataService: OptimizationWrapperService,
    public dialog: MatDialog) {}


  /**
   * Binds a popup, tooltip, click handler, and drag handler to a node marker.
   *
   * When the marker is clicked, the node properties dialog is opened. When the marker
   * is dragged (if draggable), the node's geographic position is updated in the
   * optimization input. A tooltip is always displayed showing the node ID.
   *
   * @param {*} marker - The Leaflet marker instance to bind interactions to.
   * @param {Node} node - The node data object associated with this marker.
   * @param {ElementRef} ref - The Angular element reference of the map component.
   * @param {boolean} isDraggable - Whether the marker supports drag-and-drop repositioning.
   * @memberof PopUpService
   */
  bindNodePopUp(marker: any, node: Node, ref: ElementRef, isDraggable: boolean): void {
    const popupOptions = {
      className: 'node-popup pop',
    };

    const popupContent = '<div>Node: ' + node.id + ' <br></div>';

    const popUp = L.popup().setContent(popupContent);

    marker.bindPopup(popUp, popupOptions);

    marker.on('click', () => {
      this.openNodeDialog(node.id);
      marker.closePopup();
    });

    marker.on('dragend', (event) => {
      // Handle the dragend event
      const newLatLng = event.target.getLatLng();
      this.dataService.setNodePosition(node.id, newLatLng.lat,  newLatLng.lng);
    });

    marker.bindTooltip('Node: ' + node.id + ' - Click for details' + (isDraggable?' or hold to move':''));
  }

  /**
   * Binds a popup and tooltip to a route polyline on the map.
   *
   * When the polyline is clicked (popup opens), the route result dialog is immediately
   * opened and the popup is closed. The tooltip displays the route ID and the assigned
   * resource (visitor) name.
   *
   * @param {*} polyline - The Leaflet polyline instance to bind interactions to.
   * @param {Route} route - The route data object associated with this polyline.
   * @param {ElementRef} ref - The Angular element reference of the map component.
   * @memberof PopUpService
   */
  bindPolyRoutePopUp(polyline: any, route: Route, ref: ElementRef): void {
    const popupOptions = {
      className: 'route-popup pop',
    };

    const popupInfo = `
      <div>Id: ${route.id} <br> <br> <button class="modify">See details or modify</button></div">`;

    polyline.bindPopup(popupInfo, popupOptions).on('popupopen', () => {
      this.openRouteResultDialog(route.id);
      polyline.closePopup();
    });

    polyline.bindTooltip(
      'RouteId: ' +
        (route.id + 1) +
        '; Visitor: ' +
        route.resourceId +
        ' - Click for details'
    );
  }


  /**
   * Binds a popup, tooltip, click handler, and drag handler to a resource marker.
   *
   * When the marker is clicked (popup opens), the resource properties dialog is immediately
   * opened and the popup is closed. When the marker is dragged (if draggable), the resource's
   * position is updated in the optimization input. A tooltip is always displayed showing the
   * resource ID.
   *
   * @param {*} marker - The Leaflet marker instance to bind interactions to.
   * @param {Resource} res - The resource data object associated with this marker.
   * @param {ElementRef} ref - The Angular element reference of the map component.
   * @param {boolean} isDraggable - Whether the marker supports drag-and-drop repositioning.
   * @memberof PopUpService
   */
  bindResourcePopUp(marker: any, res: Resource, ref: ElementRef, isDraggable: boolean): void {
    const popupOptions = {
      className: 'resource-popup pop',
    };

    const popupContent =
      '<div>Resource: ' +
      res.id +
      ' <br><br>  <button class="resource-popup-edit-btn popup-edit-btn">See details or modify</button></div>';

    marker.bindPopup(popupContent, popupOptions).on('popupopen', () => {
      this.openResourceDialog(res.id);
      marker.closePopup();
    });

    marker.on('dragend', (event) => {
      // Handle the dragend event
      const newLatLng = event.target.getLatLng();
      this.dataService.setResourcePosition(res.id, newLatLng.lat,  newLatLng.lng);
    });

    marker.bindTooltip('Resource: ' + res.id + ' - Click for details' + (isDraggable?' or hold to move':''));
  }


  /**
   * Opens the Angular Material dialog for viewing and editing node properties.
   *
   * The dialog displays detailed information about the node (opening hours, visit duration,
   * position, etc.) and allows the user to modify these values.
   *
   * @param {string} cNodeId - The unique identifier of the node to display in the dialog.
   * @memberof PopUpService
   */
  openNodeDialog(cNodeId: string): void {
    const dialogRef = this.dialog.open(NodePropertiesDialogComponent, {
      maxWidth: '700px',
      width: '90%',
      data: { nodeId: cNodeId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log('NodeDetailMarkerViewComponent was closed: ' + result);
    });
  }

  /**
   * Opens the Angular Material dialog for viewing and editing resource properties.
   *
   * The dialog displays detailed information about the resource (working hours, max travel
   * time, position, etc.) and allows the user to modify these values.
   *
   * @param {string} cResourceId - The unique identifier of the resource to display in the dialog.
   * @memberof PopUpService
   */
  openResourceDialog(cResourceId: string): void {
    const dialogRef = this.dialog.open(ResourcePropertiesDialogComponent, {
      maxWidth: '700px',
      width: '90%',
      data: { resId: cResourceId },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }


  /**
   * Opens the Angular Material dialog for viewing the optimization result of a specific route.
   *
   * The dialog displays the route's assigned resource, visited nodes in order, travel times,
   * distances, and any constraint violations or warnings.
   *
   * @param {number} curRouteId - The numeric identifier of the route whose results to display.
   * @memberof PopUpService
   */
  openRouteResultDialog(curRouteId: number): void {

    const dialogRef = this.dialog.open(RouteResultDialogComponent, {
      width: '80%',
      maxHeight: '80vh',
      data: { routeId: curRouteId },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
