import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/**
 * Pipe that converts duration values between different time units.
 *
 * @description Accepts a duration value with a specified source unit and converts it
 * to the desired target unit. Supports ISO 8601 duration strings (e.g. "PT1H30M"),
 * seconds, minutes, and hours as source units. The target unit can be seconds, minutes,
 * hours, or "auto" which selects the most appropriate unit based on magnitude.
 *
 * @example
 * ```html
 * {{ route.transitTime | durationFormatPipe:'PT':'auto' }}
 * <!-- Output: "45.00 [min]" for a 45-minute duration -->
 *
 * {{ '3600' | durationFormatPipe:'s':'h' }}
 * <!-- Output: "1.00 [h]" -->
 * ```
 *
 * @export
 * @class DurationFormatPipe
 * @implements {PipeTransform}
 */
@Pipe({
    name: 'durationFormatPipe',
    standalone: false
})
export class DurationFormatPipe implements PipeTransform {

  /**
   * Transforms a duration value from one unit to another.
   *
   * @param {string} durationOrg - The original duration value (numeric string or ISO 8601 duration)
   * @param {string} sourceUnit - The unit of the input value: "PT" (ISO 8601), "s" (seconds), "min" (minutes), or "h" (hours)
   * @param {string} targetUnit - The desired output unit: "s", "no_unit_s" (seconds without unit label), "min", "h", or "auto"
   * @returns {string} The formatted duration string with unit label, or undefined if targetUnit is unrecognized
   */
  transform(
    durationOrg: string,
    sourceUnit: string,
    targetUnit: string
  ): string {
    let durationSeconds;

    let duration;

    // Bring to seconds
    if (sourceUnit === 'PT') {
      durationSeconds = this.asDurationInSeconds(durationOrg);
    } else {
      duration = +durationOrg;
    }

    if (sourceUnit === 'min') {
      durationSeconds = duration * 60.0;
    }

    if (sourceUnit === 's') {
      durationSeconds = duration;
    }

    if (sourceUnit === 'h') {
      durationSeconds = duration * 3600.0;
    }

    //
    if (targetUnit === 's') {
      return durationSeconds.toFixed(0) + ' [s]';
    }

    if (targetUnit === 'no_unit_s') {
      return durationSeconds.toFixed(0);
    }

    if (targetUnit === 'min') {
      return (durationSeconds / 60.0).toFixed(2) + ' [min]';
    }

    if (targetUnit === 'h') {
      return (durationSeconds / 3600.0).toFixed(2) + ' [h]';
    }

    if (targetUnit === 'auto') {
      if (durationSeconds <= 60) {
        return durationSeconds.toFixed(0) + ' [s]';
      }

      if (durationSeconds <= 3660) {
        return (durationSeconds / 60.0).toFixed(2) + ' [min]';
      } else {
        return (durationSeconds / 3600.0).toFixed(2) + ' [h]';
      }
    }

    return undefined;
  }

  /**
   * Converts an ISO 8601 duration string to seconds using moment.js.
   *
   * @private
   * @param {string} isoValue - An ISO 8601 duration string (e.g. "PT1H30M")
   * @returns {number} The duration in seconds
   */
  private asDurationInSeconds(isoValue: string): number {
    return moment.duration(isoValue).asSeconds();
  }
}
