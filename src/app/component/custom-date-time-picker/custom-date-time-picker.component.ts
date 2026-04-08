import { Component, Input, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

/**
 * Custom date-time picker component that combines a Material datepicker with a time dropdown.
 *
 * @description Implements Angular's {@link ControlValueAccessor} interface so it can be used
 * as a form control with `ngModel` or reactive forms. The component splits a full ISO datetime
 * value into a date part (handled by Material datepicker) and a time part (handled by a
 * select dropdown with configurable minute intervals). When either part changes, the combined
 * ISO string is emitted to the parent form.
 *
 * @export
 * @class CustomDateTimePickerComponent
 * @implements {ControlValueAccessor}
 * @implements {OnChanges}
 */
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
  /** Optional start time boundary for validation purposes. */
  @Input() startTime: Date;

  /** Optional end time boundary for validation purposes. */
  @Input() endTime: Date;

  /** Form control holding the selected date value. */
  date = new FormControl(new Date());

  /** Array of time strings (e.g. "08:00", "08:30") generated at 30-minute intervals. */
  timeOptions = this.createTimeOptions(30);

  /** Form control holding the currently selected time string from the dropdown. */
  selectedTime = new FormControl(this.timeOptions[0]);

  /** Callback function registered by Angular forms to propagate value changes. */
  private onChange: (value: any) => void;

  /** Callback function registered by Angular forms to propagate touched state. */
  private onTouched: () => void;

  /**
   * Writes a new value to the component from the parent form.
   *
   * @description Parses the incoming ISO date string, sets the date form control,
   * and selects the matching time option in the dropdown. If both startTime and
   * endTime are set, endTime is cleared as a workaround for conflicting constraints.
   *
   * @param {any} value - An ISO date string or Date-compatible value
   */
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

  /**
   * Lifecycle hook responding to input property changes.
   *
   * @description Currently triggers end-time validation when startTime changes.
   * Reserved for future use.
   *
   * @param {SimpleChanges} changes - The changed input properties
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.startTime) {
      this.validateEndTime();
    }
  }

  /**
   * Validates that the selected end time is after the start time.
   *
   * @description Placeholder validation logic. Currently logs no output but can be
   * extended to display error messages or reset the time selection.
   */
  validateEndTime() {
    const endTime = new Date(this.date.value);
    if (this.startTime && endTime <= this.startTime) {
      // Handle invalid case (e.g., show an error message or reset selectedTime)
      //console.log("ERROR")
    }
  }
  // Not in use DONE

  /**
   * Generates an array of time option strings at the specified minute interval.
   *
   * @description Creates entries from "00:00" through "23:30" (or whatever interval is specified),
   * formatted as "HH:mm" strings suitable for display in a select dropdown.
   *
   * @param {number} deltaMinutes - The interval in minutes between each time option (e.g. 30)
   * @returns {string[]} Array of formatted time strings
   */
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

  /**
   * Registers the onChange callback for the ControlValueAccessor interface.
   *
   * @param {any} fn - Callback function provided by Angular forms
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registers the onTouched callback for the ControlValueAccessor interface.
   *
   * @param {any} fn - Callback function provided by Angular forms
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Called when either the date or time selection changes.
   *
   * @description Combines the selected date and time into a single Date object,
   * converts it to an ISO string, and propagates the value to the parent form
   * via the registered onChange callback.
   */
  onDateTimeChange() {

    if (this.onChange) {
      const dateValue = new Date(this.date.value); // Ensure it's a Date object
      const [hours, minutes] = this.selectedTime.value.split(':').map(str => parseInt(str, 10)); // Convert to numbers
      dateValue.setHours(hours, minutes);
      this.onChange(dateValue.toISOString()); // or another format as needed
    }
  }
}