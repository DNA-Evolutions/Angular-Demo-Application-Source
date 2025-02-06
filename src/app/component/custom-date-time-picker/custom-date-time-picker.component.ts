import { Component, Input, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

@Component({
    selector: 'app-custom-date-time-picker',
    templateUrl: './custom-date-time-picker.component.html',
    styleUrls: ['./custom-date-time-picker.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomDateTimePickerComponent),
            multi: true
        }
    ],
    standalone: false
})
export class CustomDateTimePickerComponent implements ControlValueAccessor, OnChanges {
  @Input() startTime: Date; // Input for start time TODO Maybe use later on
  @Input() endTime: Date; // Input for start time TODO Maybe use later on

  date = new FormControl(new Date());

  timeOptions = this.createTimeOptions(30);

  selectedTime = new FormControl(this.timeOptions[0]);

  private onChange: (value: any) => void;
  private onTouched: () => void;

  // Implement ControlValueAccessor interface methods
  writeValue(value: any): void {
    if (value) {

      if(this.startTime && this.endTime){
        // Not allowed => HACK undefine end
        this.endTime = undefined
      }

      const datetime = new Date(value);

      this.date.setValue(datetime);

      const formattedHours = datetime.getHours().toString().padStart(2, '0');
      const formattedMinutes = datetime.getMinutes().toString().padStart(2, '0');

      this.selectedTime.setValue(`${formattedHours}:${formattedMinutes}`);
    }
  }

  // Not in use
  ngOnChanges(changes: SimpleChanges) {
    if (changes.startTime) {
      this.validateEndTime();
    }
  }

  validateEndTime() {
    const endTime = new Date(this.date.value);
    if (this.startTime && endTime <= this.startTime) {
      // Handle invalid case (e.g., show an error message or reset selectedTime)
      //console.log("ERROR")
    }
  }
  // Not in use DONE

  createTimeOptions(deltaMinutes) {
    const timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += deltaMinutes) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        timeOptions.push(timeString);
      }
    }
    return timeOptions;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onDateTimeChange() {

    if (this.onChange) {
      const dateValue = new Date(this.date.value); // Ensure it's a Date object
      const [hours, minutes] = this.selectedTime.value.split(':').map(str => parseInt(str, 10)); // Convert to numbers
      dateValue.setHours(hours, minutes);
      this.onChange(dateValue.toISOString()); // or another format as needed
    }
  }
}