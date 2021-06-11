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
import { QualificationType } from './qualificationType';
import { TypeWithExpertise } from './typeWithExpertise';
import { TypeWithExpertiseQualificationAllOf } from './typeWithExpertiseQualificationAllOf';


export interface TypeWithExpertiseQualification extends QualificationType {
    /**
     * A list of user-provided type-names and expertise levels. A Contraint type-name with its required expertise must be fulfill by the type-with-expertise Qualification to result in a violation free solution.
     */
    typesWithExpertise: Array<TypeWithExpertise>;
    /**
     * The typeName of the object
     */
    _?: TypeWithExpertiseQualification.UEnum;
}
export namespace TypeWithExpertiseQualification {
    export type UEnum = 'TypeWithExpertise';
    export const UEnum = {
        TypeWithExpertise: 'TypeWithExpertise' as UEnum
    };
}

