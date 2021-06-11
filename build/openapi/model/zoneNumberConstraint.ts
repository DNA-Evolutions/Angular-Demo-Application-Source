/**
 * DNA Evolutions - JOpt.TourOptimizer
 * This is DNA\'s JOpt.TourOptimizer service. A RESTful Spring Boot application using springdoc-openapi and OpenAPI 3.
 *
 * The version of the OpenAPI document: unknown
 * Contact: info@dna-evolutions.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ZoneNumberConstraintAllOf } from './zoneNumberConstraintAllOf';
import { ZoneNumber } from './zoneNumber';
import { ConstraintType } from './constraintType';


export interface ZoneNumberConstraint extends ConstraintType {
    /**
     * The zoneCodes
     */
    zoneCodes: Array<ZoneNumber>;
    /**
     * The typeName of the object
     */
    _?: ZoneNumberConstraint.UEnum;
}
export namespace ZoneNumberConstraint {
    export type UEnum = 'ZoneNumberConstraint';
    export const UEnum = {
        ZoneNumberConstraint: 'ZoneNumberConstraint' as UEnum
    };
}

