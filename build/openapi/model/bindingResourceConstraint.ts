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
import { ResourceWithPriority } from './resourceWithPriority';
import { BindingResourceConstraintAllOf } from './bindingResourceConstraintAllOf';
import { ConstraintType } from './constraintType';


export interface BindingResourceConstraint extends ConstraintType {
    /**
     * The resources that can be choosen to visit a certain node.
     */
    resources: Array<ResourceWithPriority>;
    /**
     * The typeName of the object
     */
    _?: BindingResourceConstraint.UEnum;
}
export namespace BindingResourceConstraint {
    export type UEnum = 'BindingResource';
    export const UEnum = {
        BindingResource: 'BindingResource' as UEnum
    };
}

