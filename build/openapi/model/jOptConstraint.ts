/**
 * DNA Evolutions - JOpt.TourOptimizer
 * This is DNA\'s JOpt.TourOptimizer service. A RESTful Spring Boot application using springdoc-openapi and OpenAPI 3.
 *
 * The version of the OpenAPI document: 1.0.1-SNAPSHOT
 * Contact: info@dna-evolutions.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { JOptBindingResourceConstraint } from './jOptBindingResourceConstraint';
import { JOptExcludingResourceConstraint } from './jOptExcludingResourceConstraint';


/**
 * The constraint for the node
 */
export interface JOptConstraint { 
    /**
     * The list of binding resource constraints
     */
    bindingResources: Array<JOptBindingResourceConstraint>;
    /**
     * The list of excluding resource constraints
     */
    excludingResources: Array<JOptExcludingResourceConstraint>;
}

