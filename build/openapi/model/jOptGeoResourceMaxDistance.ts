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
import { JOptEdgeConnectionDistanceUnit } from './jOptEdgeConnectionDistanceUnit';


/**
 * The maxDistance a resource is allowed to cover
 */
export interface JOptGeoResourceMaxDistance { 
    unit?: JOptEdgeConnectionDistanceUnit;
    value?: number;
}

