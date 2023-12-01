/**
 * DNA Evolutions - JOpt.TourOptimizer
 * This is DNA\'s JOpt.TourOptimizer service. A RESTful Spring Boot application using springdoc-openapi and OpenAPI 3. JOpt.TourOpptimizer is a service that delivers route optimization and automatic scheduling features to be easily integrated into any third-party application. JOpt.TourOpptimizer encapsulates all necessary optimization functionality and provides a comprehensive REST API that offers a domain-specific optimization interface for the transportation industry. The service is stateless and does not come with graphical user interfaces, map depiction or any databases. These extensions and adjustments are supposed to be introduced by the consumer of the service while integrating it into his/her own application. The service will allow for many suitable adjustments and user-specific settings to adjust the behaviour and optimization goals (e.g. minimizing distance, maximizing resource utilization, etc.) through a comprehensive set of functions. This will enable you to gain control of the complete optimization processes.This service is based on JOpt (7.5.0-SNAPSHOT)
 *
 * The version of the OpenAPI document: 1.2.5-SNAPSHOT
 * Contact: info@dna-evolutions.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ConnectionRelatedLateMargin } from './connectionRelatedLateMargin';


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
    connectionRelatedLateMargin?: ConnectionRelatedLateMargin;
    /**
     * The boolean isOverwritingRouteTermination. Instead of using the default termination element of the route, the geoPillar will be used as so-called endAnchor.
     */
    isOverwritingRouteTermination?: boolean;
    /**
     * The boolean isOverwritingRouteStart. Instead of using the default start element of the route, the geoPillar will be used as so-called startAnchor.
     */
    isOverwritingRouteStart?: boolean;
    /**
     * The isSchedulableBeforeWorkingHours
     */
    isSchedulableBeforeWorkingHours?: boolean;
    /**
     * The isSchedulableAfterWorkingHours
     */
    isSchedulableAfterWorkingHours?: boolean;
    /**
     * The isTimeAdjustableAnchor
     */
    isTimeAdjustableAnchor?: boolean;
    /**
     * The isAutoTransformable2StartAnchor
     */
    isAutoTransformable2StartAnchor?: boolean;
    /**
     * The isForcedStayNode
     */
    isForcedStayNode?: boolean;
}

