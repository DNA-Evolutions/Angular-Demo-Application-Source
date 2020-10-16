import { Injectable, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { OptimizationWrapperService } from '../../optimization-wrapper/optimization-wrapper.service';
import { PopUpService } from '../pop-up/leaflet-popup.service';
import { MatDialog } from '@angular/material/dialog';
import { NodePropertiesDialogComponent } from 'src/app/component/optimization-elements/node/node-properties-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class LeafletMarkerService {

    constructor(private dataService: OptimizationWrapperService, private popupService: PopUpService) { }

    markNodes(map: L.map, ref: ElementRef, icon: any): void {
        // Get nodes
        this.dataService.nodes().forEach(n => {
            const lat = n.position.geoCoordinate.latitude;
            const lon = n.position.geoCoordinate.longitude;
            const marker = L.marker([lat, lon], { icon });

            this.popupService.bindNodePopUp(marker, n, ref);

            marker.addTo(map);
        });
    }

    markResources(map: L.map, ref: ElementRef, icon: any): void {
        // Get nodes
        this.dataService.resources().forEach(r => {
            const lat = r.position.geoCoordinate.latitude;
            const lon = r.position.geoCoordinate.longitude;

            const marker = L.marker([lat, lon], { icon });

            this.popupService.bindResourcePopUp(marker, r, ref);
            marker.addTo(map);

        });

    }

    //     buildMarkers() {
    //     const popupOptions = {
    //       className: "customPopup test2"
    //     };
    //     for (let artwork of this.artworkList) {
    //       const popupInfo = `
    //       ${artwork.name} <br> ${
    //         artwork.filename
    //       } <br> <button class="edit">Edit</button>
    //       <br> <button class="delete">Delete</button>
    //       `;
    //       L.marker([artwork.latitude, artwork.longitude], this.markerIcon)
    //         .addTo(this.map)
    //         .bindPopup(popupInfo, popupOptions)
    //         .on("popupopen", () => {
    //           this.elementRef.nativeElement
    //             .querySelector(".edit")
    //             .addEventListener("click", e => {
    //               this.editArtwork();
    //             });
    //         })
    //         .on("popupopen", e => {
    //           this.elementRef.nativeElement
    //             .querySelector(".delete")
    //             .addEventListener("click", e => {
    //               this.deleteArtwork();
    //             });
    //         });
    //     }
    //   }

    //   makeCapitalMarkers(map: L.map): void {
    //     this.http.get(this.capitals).subscribe((res: any) => {
    //       for (const c of res.features) {
    //         const lat = c.geometry.coordinates[0];
    //         const lon = c.geometry.coordinates[1];
    //         const marker = L.marker([lon, lat]).addTo(map);
    //       }
    //     });
    //   }
}