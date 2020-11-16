import { Injectable, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { OptimizationWrapperService } from '../../optimization-wrapper/optimization-wrapper.service';
import { PopUpService } from '../pop-up/leaflet-popup.service';

@Injectable({
  providedIn: 'root',
})
export class LeafletMarkerService {
  constructor(
    private dataService: OptimizationWrapperService,
    private popupService: PopUpService
  ) {}

  markNodes(map: L.map, ref: ElementRef, icon: any): void {
    // Get nodes
    this.dataService.nodes().forEach((n) => {
      const lat = n.position.geoCoordinate.latitude;
      const lon = n.position.geoCoordinate.longitude;
      const marker = L.marker([lat, lon], { icon });

      this.popupService.bindNodePopUp(marker, n, ref);

      marker.addTo(map);
    });
  }

  markResources(map: L.map, ref: ElementRef, icon: any): void {
    // Get nodes
    this.dataService.resources().forEach((r) => {
      const lat = r.position.geoCoordinate.latitude;
      const lon = r.position.geoCoordinate.longitude;

      const marker = L.marker([lat, lon], { icon });

      this.popupService.bindResourcePopUp(marker, r, ref);
      marker.addTo(map);
    });
  }
}
