import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateFormatPipe',
})
export class DateFormatPipe implements PipeTransform {
    transform(dateTime: string): string {
        const datePipe = new DatePipe('en-US');
        const myTime = new Date(dateTime);
        return datePipe.transform(myTime, 'h:mm:ss a - (MMM d)');
    }
}
