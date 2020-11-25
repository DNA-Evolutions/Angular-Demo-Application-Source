/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { JOptGeoPosition } from './jOptGeoPosition';
import { JOptGeoNodeVisitDuration } from './jOptGeoNodeVisitDuration';
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
    /**
     * The unique id of the GeoNode
     */
    id: string;
    position: JOptGeoPosition;
    workNode?: boolean;
    stayNode?: boolean;
}

