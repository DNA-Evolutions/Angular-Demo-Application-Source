import { FormGroup, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

// custom validator to check that two fields match
export function ValidTimeWindow(controlName: string) {

    return (formGroup: FormGroup) => {


        // console.log(controlName);
        // console.log('===');
        // console.log(formGroup);
        // console.log('===');
        // console.log(formGroup.controls);


        const presentKeys = Object.keys(formGroup.controls);

        // Try to find twstart and twend
        const starts = presentKeys.filter(key => key.includes('twstart'));
        const ends = presentKeys.filter(key => key.includes('twend'));



        if (starts === undefined || ends === undefined) {
            return null;
        }

        if (starts.length !== ends.length) {
            return null;
        }

        let lastEndMillis;
        let lastEndControl;

        // Sort items
        for (let i = 0; i < starts.length; i++) {
            //console.log(lastEndMillis);

            const curStartControl = formGroup.controls[starts[i]];
            const curEndControl = formGroup.controls[ends[i]];

            const curStart = curStartControl.value;
            const curEnd = curEndControl.value;

            // Is Start before end?
            const curStartMillis = new Date(curStart).getTime();
            const curEndMillis = new Date(curEnd).getTime();

            
            if (curStartMillis > 0 && curEndMillis > 0){

                //console.log(curStartMillis);
                //console.log(curEndMillis);

                if ( curEndMillis <= curStartMillis) {
                    // Error
                    console.log('END BEFORE START');
                    console.log(curStart);
                    console.log(curEnd);
                    curEndControl.setErrors({ endBeforeStart: true });
                }
            }

            if (lastEndMillis !== undefined){
                if (curStartMillis < lastEndMillis){
                    console.log('Hours overlapping');
                    curStartControl.setErrors({ overlapping: true });
                    curEndControl.setErrors({ overlapping: true });
                    lastEndControl.setErrors({ overlapping: true });
                }
            }

            lastEndMillis = curEndMillis;
            lastEndControl = curEndControl;

            //console.log('===');
            //console.log(curStart);
            //console.log(curStartMillis);
            //console.log(curEnd);
            //console.log(curEndMillis);
        }

        //console.log(starts);
        //console.log(ends);

        // const matchingControl = formGroup.controls[matchingControlName];

        //if(control === undefined || control.value === undefined){
        //    return null;
        //}

        //return null;
        // // return null if controls haven't initialised yet
        // if (!control || !matchingControl) {
        //   return null;
        // }

        // // return null if another validator has already found an error on the matchingControl
        // if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        //     return null;
        // }

        // // set error on matchingControl if validation fails
        // if (control.value !== matchingControl.value) {
        //     matchingControl.setErrors({ mustMatch: true });
        // } else {
        //     matchingControl.setErrors(null);
        // }
    }

}

