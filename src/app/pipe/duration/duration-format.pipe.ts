import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'durationFormatPipe',
})
export class DurationFormatPipe implements PipeTransform {

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

  private asDurationInSeconds(isoValue: string): number {
    return moment.duration(isoValue).asSeconds();
  }
}
