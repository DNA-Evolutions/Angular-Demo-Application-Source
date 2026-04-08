import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidationErrors, FormGroup } from '@angular/forms';

import { ValidTimeWindow } from './valid-timewindow.validator';


/**
 * Directive for validating time windows of Nodes and Resources in template-driven forms.
 *
 * @description Applied as an attribute directive (`[validTimeWindow]`) on form elements that
 * contain time window inputs. It delegates validation logic to the {@link ValidTimeWindow}
 * validator function, which checks that the end time of a time window is after its start time.
 * The directive registers itself with Angular's {@link NG_VALIDATORS} so it integrates
 * seamlessly with Angular's form validation pipeline.
 *
 * @example
 * ```html
 * <div ngModelGroup="openingHours" [validTimeWindow]="['openingHours']">
 *   <!-- time window inputs here -->
 * </div>
 * ```
 *
 * @export
 * @class ValidTimeWindowDirective
 * @implements {Validator}
 */
@Directive({
    selector: '[validTimeWindow]',
    providers: [{ provide: NG_VALIDATORS, useExisting: ValidTimeWindowDirective, multi: true }],
    standalone: false
})


export class ValidTimeWindowDirective implements Validator {
    /**
     * Array of field name prefixes used to locate the time window controls within the form group.
     * Passed from the template via the directive's selector attribute binding.
     */
    @Input() validTimeWindow: string[] = [];

    /**
     * Validates the form group by delegating to the {@link ValidTimeWindow} validator.
     *
     * @param {FormGroup} formGroup - The form group containing the time window controls
     * @returns {ValidationErrors} Validation errors object, or null if the time window is valid
     */
    validate(formGroup: FormGroup): ValidationErrors {
        return ValidTimeWindow(this.validTimeWindow[0])(formGroup);
    }
}
