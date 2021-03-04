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
import { JOptEdgeConnectionTimeUnits } from './jOptEdgeConnectionTimeUnits';


/**
 * The time needed for the connection, if no time is provided,the time will be auto-calculated
 */
export interface JOptEdgeConnectionTime { 
    seconds?: number;
    units?: Array<JOptEdgeConnectionTimeUnits>;
    zero?: boolean;
    negative?: boolean;
    nano?: number;
}

