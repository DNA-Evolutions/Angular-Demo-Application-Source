import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * Pipe that formats an ISO date string into a human-readable time and date format.
 *
 * @description Converts an ISO date string (e.g. "2024-03-15T14:30:00Z") into the
 * format "2:30:00 PM - (Mar 15)" using the Angular {@link DatePipe} with the en-US locale.
 * Used throughout the demo to display schedule times in route results and node details.
 *
 * @example
 * ```html
 * {{ node.arrivalTime | dateFormatPipe }}
 * <!-- Output: "2:30:00 PM - (Mar 15)" -->
 * ```
 *
 * @export
 * @class DateFormatPipe
 * @implements {PipeTransform}
 */
@Pipe({
    name: 'dateFormatPipe',
    standalone: false
})
export class DateFormatPipe implements PipeTransform {
    /**
     * Transforms an ISO date string into a formatted time and date string.
     *
     * @param {string} dateTime - An ISO 8601 date string to format
     * @returns {string} The formatted date string in "h:mm:ss a - (MMM d)" format
     */
    transform(dateTime: string): string {
        const datePipe = new DatePipe('en-US');
        const myTime = new Date(dateTime);
        return datePipe.transform(myTime, 'h:mm:ss a - (MMM d)');
    }
}
