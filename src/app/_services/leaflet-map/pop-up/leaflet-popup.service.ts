import { Injectable, ElementRef } from '@angular/core';
import { JOptGeoNode, JOptGeoResource, JOptRoute } from 'build/openapi';
import { MatDialog } from '@angular/material/dialog';
import { NodePropertiesDialogComponent } from 'src/app/component/optimization-elements/node/node-properties-dialog.component';
import { ResourcePropertiesDialogComponent } from 'src/app/component/optimization-elements/resource/resource-properties-dialog.component';
import * as L from 'leaflet';
import { RouteResultDialogComponent } from 'src/app/component/optimization-elements/result/route/route-result/route-result-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class PopUpService {
  constructor(public dialog: MatDialog) {}

  // TODO refresh popupinfo after modification
  // TODO add scss for class nodepopup and prettyfiy
  bindNodePopUp(marker: any, node: JOptGeoNode, ref: ElementRef): void {
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

    marker.bindTooltip('Node: ' + node.id + ' - Click for details');
  }

  //
  bindPolyRoutePopUp(polyline: any, route: JOptRoute, ref: ElementRef): void {
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
        route.visitorId +
        ' - Click for details'
    );
  }

  bindResourcePopUp(marker: any, res: JOptGeoResource, ref: ElementRef): void {
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

    marker.bindTooltip('Resource: ' + res.id + ' - Click for details');
  }

  /*
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

  openResourceDialog(cResourceId: string): void {
    const dialogRef = this.dialog.open(ResourcePropertiesDialogComponent, {
      maxWidth: '700px',
      width: '90%',
      data: { resId: cResourceId },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openRouteResultDialog(curRouteId: number): void {
    console.log(curRouteId);
    const dialogRef = this.dialog.open(RouteResultDialogComponent, {
      width: '80%',
      maxHeight: '80vh',
      data: { routeId: curRouteId },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
