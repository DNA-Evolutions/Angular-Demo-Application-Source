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
import { TypeWithExpertise } from './typeWithExpertise';


export interface TypeWithExpertiseQualificationAllOf {
    /**
     * A list of user-provided type-names and expertise levels. A Contraint type-name with its required expertise must be fulfill by the type-with-expertise Qualification to result in a violation free solution.
     */
    typesWithExpertise?: Array<TypeWithExpertise>;
    /**
     * The typeName of the object
     */
    _?: TypeWithExpertiseQualificationAllOf.UEnum;
}
export namespace TypeWithExpertiseQualificationAllOf {
    export type UEnum = 'TypeWithExpertise';
    export const UEnum = {
        TypeWithExpertise: 'TypeWithExpertise' as UEnum
    };
}

