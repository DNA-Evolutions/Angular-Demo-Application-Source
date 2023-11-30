import { Injectable, ElementRef } from '@angular/core';
import { GeoNode, Resource, Route, Node } from 'build/openapi';
import { MatDialog } from '@angular/material/dialog';
import { NodePropertiesDialogComponent } from 'src/app/component/optimization-elements/node/node-properties-dialog.component';
import { ResourcePropertiesDialogComponent } from 'src/app/component/optimization-elements/resource/resource-properties-dialog.component';
import * as L from 'leaflet';
import { RouteResultDialogComponent } from 'src/app/component/optimization-elements/result/route/route-result/route-result-dialog.component';
import { OptimizationWrapperService } from '../../optimization-wrapper/optimization-wrapper.service';

/**
 *
 * Service to create popups for markers.
 *
 * @export
 * @class PopUpService
 */
@Injectable({
  providedIn: 'root',
})
export class PopUpService {
  constructor(
    private dataService: OptimizationWrapperService,
    public dialog: MatDialog) {}


  /**
   *
   * Binds a pupop to a node marker
   *
   * @param {*} marker
   * @param {JOptGeoNode} node
   * @param {ElementRef} ref
   * @memberof PopUpService
   */
  bindNodePopUp(marker: any, node: Node, ref: ElementRef): void {
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

    marker.bindTooltip('Node: ' + node.id + ' - Click for details');
  }

  //
  /**
   *
   * Bind a popup to the polyline between two markers
   *
   * @param {*} polyline
   * @param {JOptRoute} route
   * @param {ElementRef} ref
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
   *
   * Binds a pupop to a resource marker
   *
   * @param {*} marker
   * @param {JOptGeoResource} res
   * @param {ElementRef} ref
   * @memberof PopUpService
   */
  bindResourcePopUp(marker: any, res: Resource, ref: ElementRef): void {
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

    marker.bindTooltip('Resource: ' + res.id + ' - Click for details');
  }


  /**
   *
   * Opens a node dialog from a node popup marker
   *
   * @param {string} cNodeId
   * @memberof PopUpService
   */
  openNodeDialog(cNodeId: string): void {
    const dialogRef = this.dialog.open(NodePropertiesDialogComponent, {
      maxWidth: '700px',
      width: '90%',
      data: { nodeId: cNodeId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('NodeDetailMarkerViewComponent was closed: ' + result);
    });
  }

  /**
   * Opens a resource dialog from a resource popup marker
   *
   * @param {string} cResourceId
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
   *
   * Opens a route result dialog from a route-polyline between two markers
   *
   * @param {number} curRouteId
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
