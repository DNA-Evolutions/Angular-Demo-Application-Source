import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { JOptOptimizationInput } from 'build/openapi';
import { GeoAndRoutingService } from '../_services/geo-and-routing/geo-and-routing.service';


@Injectable({
  providedIn: 'root'
})
export class LoadDefaultInputOptimizationDataService {


  private defaultInput: JOptOptimizationInput = null;

  constructor(private http: HttpClient, geo: GeoAndRoutingService) {
    console.log('LoadDefaultInputOptimizationDataService constructor called');
    //geo.load();
    // this.getJSON().subscribe(data => {
    //  console.log('Read-In-default data');
    //  console.log(data);
    //});
  }

  public input(): JOptOptimizationInput {
    return this.defaultInput;
  }

  private getJSON(): Observable<any> {
    return this.http.get('../../assets/optimizationInput.json');
  }


  load(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.getJSON()
        .subscribe(data => {
          this.defaultInput = data;
          resolve(true);
        });
    });
  }

}
