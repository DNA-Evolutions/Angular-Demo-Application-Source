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


/**
 * The optional pillarNode. If a node has the pillarNode attibute attached, it becomes a pillar node itself. A pillar nodes openingHour cannot be violated. If a violation cannot be avoided, the pillar will be unassigned instead of being violated.
 */
export interface GeoPillarNode { 
    /**
     * The attached resourceId. A geoPillar must be visited by this resource.
     */
    attachedResourceId?: string;
    /**
     * The onlyScheduledInCompany
     */
    onlyScheduledInCompany?: boolean;
    /**
     * The isTimeAdjustableAnchor
     */
    isTimeAdjustableAnchor?: boolean;
    /**
     * The isAutoTransformable2StartAnchor
     */
    isAutoTransformable2StartAnchor?: boolean;
    /**
     * The isSchedulableBeforeWorkingHours
     */
    isSchedulableBeforeWorkingHours?: boolean;
    /**
     * The isSchedulableAfterWorkingHours
     */
    isSchedulableAfterWorkingHours?: boolean;
    /**
     * The boolean isOverwritingRouteStart. Instead of using the default start element of the route, the geoPillar will be used as so-called startAnchor.
     */
    isOverwritingRouteStart?: boolean;
    /**
     * The boolean isOverwritingRouteTermination. Instead of using the default termination element of the route, the geoPillar will be used as so-called endAnchor.
     */
    isOverwritingRouteTermination?: boolean;
    /**
     * The isForcedStayNode
     */
    isForcedStayNode?: boolean;
}
