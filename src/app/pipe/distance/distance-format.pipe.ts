import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe that converts distance values between meters and kilometers.
 *
 * @description Accepts a distance value (or a string containing a numeric value) with a
 * specified source unit and converts it to the desired target unit. The input value is
 * extracted using a regex pattern, making it tolerant of strings that contain additional text.
 *
 * @example
 * ```html
 * {{ route.distance | distanceFormatPipe:'m':'km' }}
 * <!-- Output: "12.345 [km]" -->
 * ```
 *
 * @export
 * @class DistanceFormatPipe
 * @implements {PipeTransform}
 */
@Pipe({
    name: 'distanceFormatPipe',
    standalone: false
})
export class DistanceFormatPipe implements PipeTransform {
  /**
   * Transforms a distance value from one unit to another.
   *
   * @param {any} distanceOrg - The original distance value (number or string containing a number)
   * @param {string} sourceUnit - The unit of the input value: "m" (meters) or "km," (kilometers)
   * @param {string} targetUnit - The desired output unit: "m" (meters) or "km" (kilometers)
   * @returns {string} The formatted distance string with unit label, or undefined if targetUnit is unrecognized
   */
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

  /**
   * Extracts a numeric value from a string using a regex pattern.
   *
   * @description Matches the first occurrence of a decimal number pattern (e.g. "123.456")
   * in the input string. Returns 0.0 if no match is found.
   *
   * @private
   * @param {string} desc - The input string potentially containing a numeric value
   * @returns {number} The extracted number, or 0.0 if no number was found
   */
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
