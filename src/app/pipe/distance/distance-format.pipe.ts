import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distanceFormatPipe',
})
export class DistanceFormatPipe implements PipeTransform {
  transform(distanceOrg: any, sourceUnit: string, targetUnit: string): string {
    const distance: number = this.extractNumber(distanceOrg);

    let distanceMeters;

    // Bring to seconds
    if (sourceUnit === 'm') {
      distanceMeters = distance;
    }

    if (sourceUnit === 'km,') {
      distanceMeters = distance * 1000.0;
    }

    //
    if (targetUnit === 'm') {
      return distanceMeters.toFixed(3) + ' [m]';
    }

    if (targetUnit === 'km') {
      return (distanceMeters / 1000.0).toFixed(3) + ' [km]';
    }

    return undefined;
  }

  private extractNumber(desc: string): number {
    // Eg:
    // PC 98.0, RE 1, AL GeneticEvolution, JC 1060.0160654939095, RC 4, EC 8, TC 12, TT[h] 16, TU[%] 24, TD[km] 978.257,

    // Regexp = (?<=JC.)\d+.\d+
    const regexp: RegExp = /\d+.\d+/;

    const matchArray = desc.match(regexp);

    if (matchArray === null || matchArray.length === 0) {
      return 0.0;
    }

    return +matchArray[0];
  }
}
