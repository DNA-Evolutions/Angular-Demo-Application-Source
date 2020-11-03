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
import { JOptViolation } from './jOptViolation';
import { JOptSolutionRouteHeaderProdTime } from './jOptSolutionRouteHeaderProdTime';
import { JOptSolutionRouteHeaderTime } from './jOptSolutionRouteHeaderTime';
import { JOptSolutionRouteHeaderTranTime } from './jOptSolutionRouteHeaderTranTime';
import { JOptSolutionRouteHeaderDistance } from './jOptSolutionRouteHeaderDistance';
import { JOptSolutionRouteHeaderTermiTime } from './jOptSolutionRouteHeaderTermiTime';
import { JOptSolutionRouteHeaderTermiDistance } from './jOptSolutionRouteHeaderTermiDistance';
import { JOptSolutionRouteHeaderIdleTime } from './jOptSolutionRouteHeaderIdleTime';


/**
 * The route header, carrying information about the solution.
 */
export interface JOptSolutionRouteHeader { 
    /**
     * The abstract cost of the route
     */
    cost: number;
    time: JOptSolutionRouteHeaderTime;
    idleTime: JOptSolutionRouteHeaderIdleTime;
    prodTime: JOptSolutionRouteHeaderProdTime;
    tranTime: JOptSolutionRouteHeaderTranTime;
    termiTime: JOptSolutionRouteHeaderTermiTime;
    distance: JOptSolutionRouteHeaderDistance;
    termiDistance: JOptSolutionRouteHeaderTermiDistance;
    /**
     * Is an alternate destination in use?
     */
    isAlternateDestination: boolean;
    /**
     * Is the route closed?
     */
    isClosed: boolean;
    /**
     * The route violations, like overtime
     */
    routeViolations: Array<JOptViolation>;
    closed?: boolean;
    alternateDestination?: boolean;
}
