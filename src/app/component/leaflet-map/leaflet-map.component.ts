import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';

import {
    JOptOptimizationInput,
    JOptOptimizationOutput,
    JOptGeoNode,
    JOptGeoResource,
    JOptOptimizationRunOptions,
    JOptOpeningHours,
    JOptWorkingHours,
    OptimizationServiceControllerService,
    JOptRouteElementDetail,
    JOptRoute,
    JOptGeoNodeVisitDuration
} from 'build/openapi';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';

const iconDefault = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

import { GeoAndRoutingService } from 'src/app/_services/geo-and-routing/geo-and-routing.service';
import { LeafletMarkerService } from 'src/app/_services/leaflet-map/marker/leaflet-marker.service';
import { MapViewDefinition } from 'src/app/_services/leaflet-map/interface/map-view-defintion';
import { MatDialog } from '@angular/material/dialog';
import { NodePropertiesDialogComponent } from '../optimization-elements/node/node-properties-dialog.component';
import { LeafletPolylineService } from 'src/app/_services/leaflet-map/polyline/leaflet-polyline.service';
import { OptimizationWrapperService } from 'src/app/_services/optimization-wrapper/optimization-wrapper.service';
import { EventHandler } from '../remove/map/interfaces/event-handler';

import { MapIconResourceOptions } from './marker-icon/map-icon-resource-options';
import { MapIconNodeOptions } from './marker-icon/map-icon-node-options';
import { Observable } from 'rxjs';
import { OptimizationResultDialogComponent } from '../optimization-elements/result/optimization/optimization-result/opti-result-dialog.component';

@Component({
    selector: 'app-leaflet-map',
    templateUrl: './leaflet-map.component.html',
    styleUrls: ['./leaflet-map.component.scss']
})
export class LeafletMapComponent implements AfterViewInit, OnDestroy {

    private map: any;
    private mapViewDef: MapViewDefinition;
    private tiles: any;
    public mcText: string;

    protected onMouseMoveHandler: EventHandler;

    myOptimizationOutput$: Observable<JOptOptimizationOutput>;

    constructor(
        private markerService: LeafletMarkerService,
        private geoService: GeoAndRoutingService,
        private elementRef: ElementRef,
        private polylineService: LeafletPolylineService,
        private optiService: OptimizationWrapperService,
        public dialog: MatDialog) {

        this.onMouseMoveHandler = (evt: any) => this.onMapMouseMove(evt);
        this.myOptimizationOutput$ = this.optiService.optimizationOutputObservable();
    }

    ngAfterViewInit(): void {
        this.initMap();
        this.initMapHandlers();

        //console.log('LeafletMapComponent ngAfterViewInit called');
        this.myOptimizationOutput$.subscribe((result: JOptOptimizationOutput) => {
            console.log('Drawing result');
            this.refreshMap();
            result.solution.routes.forEach((r, index) => {
                //console.log('Draw lines');
                this.polylineService.drawRouteResultPolyline(r, index, this.elementRef, this.map);
            });
        });

        this.optiService.getRefreshObservable().subscribe((result: boolean) => {
            if (result) {
                console.log('Refresh Map');
                this.refreshMapCenter();
                this.refreshMap();
                // Set map to new position
                //asd
                //asd
            }

        });
    }


    protected initMapHandlers(): void {
        this.map.on('mousemove', this.onMouseMoveHandler);

    }

    public refreshMap(): void {
        //console.log('Removing layers');
        this.map.eachLayer(curLayer => {
            if (curLayer !== this.tiles) {
                this.map.removeLayer(curLayer);
            }

        });

        //console.log('Adding markers');
        this.addMarksers();
    }

    public refreshMapCenter(): void{
        const mapViewDef = this.geoService.mapViewDef();

        console.log(mapViewDef);
        this.map.setView(mapViewDef.center,mapViewDef.zoom, { animation: true });
        //this.map.setZoom(mapViewDef.zoom, {animationEnd: true});
    }

    private addMarksers(): void {

        const iconNode = L.icon({
            iconUrl: MapIconNodeOptions.mapIcon,
            iconSize: MapIconNodeOptions.iconSize,
            iconAnchor: MapIconNodeOptions.iconAnchor,
            shadowUrl: MapIconNodeOptions.mapShadowIcon,
            shadowSize: MapIconNodeOptions.shadowSize,
            shadowAnchor: MapIconNodeOptions.shadowAnchor,
        });

        const iconResource = L.icon({
            iconUrl: MapIconResourceOptions.mapIcon,
            iconSize: MapIconResourceOptions.iconSize,
            iconAnchor: MapIconResourceOptions.iconAnchor,
            shadowUrl: MapIconResourceOptions.mapShadowIcon,
            shadowSize: MapIconResourceOptions.shadowSize,
            shadowAnchor: MapIconResourceOptions.shadowAnchor,
        });

        this.markerService.markNodes(this.map, this.elementRef, iconNode);
        this.markerService.markResources(this.map, this.elementRef, iconResource);
    }

    private initMap(): void {
        this.mapViewDef = this.geoService.mapViewDef();

        this.map = L.map('map', {
            center: this.mapViewDef.center,
            zoom: this.mapViewDef.zoom
        });

        this.tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        this.tiles.addTo(this.map);

        this.addMarksers();
    }

    protected onMapMouseMove(evt: any): void {
        const offset: { x: number, y: number } = getCurrentOffset(this.map);

        // uncomment to study offset
        // console.log('offset computation:', offset);

        // Lat and Long are embedded in the event object
        const lat: string = evt.latlng.lat.toFixed(3);
        const long: string = evt.latlng.lng.toFixed(3);
        const zoom: string = this.map.getZoom();
        this.mcText = `Latitude: ${lat} &nbsp; &nbsp; Longitude: ${long} &nbsp; Zoom: ${zoom}`;
        //console.log('move' + this.mcText);
    }

    public ngOnDestroy(): void {
        this.map.off('mousemove', this.onMouseMoveHandler);
    }


    openOptimizationResultDialog(output: JOptOptimizationOutput): void {
      console.log(output);
      const dialogRef = this.dialog.open(OptimizationResultDialogComponent, {
          width: '1000px',
          maxHeight: '80vh',
          data: { result: output }
      });

      dialogRef.afterClosed().subscribe(result => {


          //const runDialogRef: MatDialogRef<RunOptimizationDialogComponent> = result;

          //runDialogRef.afterClosed().subscribe(optimizationResult => {
          //  console.log('Got optimization result: ' + optimizationResult);
          //});

      });


  }



}

export const getCurrentOffset = (map: any): { x: number, y: number } => {

    const layerCorner: L.Point = map.getPixelOrigin();
    const mapCorner: L.Point = map.getPixelBounds().min;

    let xVal = 0;
    let yVal = 0;

    if (!layerCorner.equals(mapCorner)) {
        xVal = layerCorner.x - mapCorner.x;
        yVal = layerCorner.y - mapCorner.y;
    }

    return { x: xVal, y: yVal };
};
