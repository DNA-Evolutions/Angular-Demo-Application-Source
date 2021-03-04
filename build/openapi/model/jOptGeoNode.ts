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
import { JOptGeoPosition } from './jOptGeoPosition';
import { JOptGeoNodeVisitDuration } from './jOptGeoNodeVisitDuration';
import { JOptNodeLoad } from './jOptNodeLoad';
import { JOptConstraint } from './jOptConstraint';
import { JOptOpeningHours } from './jOptOpeningHours';


/**
 * The list of geoNodes
 */
export interface JOptGeoNode { 
    /**
     * The list of openingHours
     */
    openingHours: Array<JOptOpeningHours>;
    visitDuration: JOptGeoNodeVisitDuration;
    constraints: JOptConstraint;
    load: JOptNodeLoad;
    /**
     * The unique id of the GeoNode
     */
    id: string;
    position: JOptGeoPosition;
    stayNode?: boolean;
    workNode?: boolean;
}

