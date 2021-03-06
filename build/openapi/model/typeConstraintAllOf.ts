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


export interface TypeConstraintAllOf {
    /**
     * A list of user-provided type-names. A Contraint type name must match to a Qualification type name to result in a violation free solution.
     */
    typeNames?: Array<string>;
    /**
     * The typeName of the object
     */
    _?: TypeConstraintAllOf.UEnum;
}
export namespace TypeConstraintAllOf {
    export type UEnum = 'Type';
    export const UEnum = {
        Type: 'Type' as UEnum
    };
}


