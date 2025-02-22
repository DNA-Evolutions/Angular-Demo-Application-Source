/**
 * DNA Evolutions - JOpt.TourOptimizer
 * This is DNA\'s JOpt.TourOptimizer service. A RESTful Spring Boot application using springdoc-openapi and OpenAPI 3. JOpt.TourOptimizer is a service that delivers route optimization and automatic scheduling features to be easily integrated into any third-party application. JOpt.TourOptimizer encapsulates all necessary optimization functionality and provides a comprehensive REST API that offers a domain-specific optimization interface for the transportation industry. The service is stateless and does not come with graphical user interfaces, map depiction or any databases. These extensions and adjustments are supposed to be introduced by the consumer of the service while integrating it into his/her own application. The service will allow for many suitable adjustments and user-specific settings to adjust the behaviour and optimization goals (e.g. minimizing distance, maximizing resource utilization, etc.) through a comprehensive set of functions. This will enable you to gain control of the complete optimization processes.This service is based on JOpt (7.5.1-rc3-j17-SNAPSHOT)
 *
 * The version of the OpenAPI document: unknown
 * Contact: info@dna-evolutions.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Constraint } from './constraint';


export interface ConnectedConstraintAllOf { 
    constraintOne?: Constraint;
    constraintTwo?: Constraint;
    /**
     * The connectionType
     */
    connectionType?: ConnectedConstraintAllOf.ConnectionTypeEnum;
    /**
     * The typeName of the object
     */
    typeName?: string;
}
export namespace ConnectedConstraintAllOf {
    export type ConnectionTypeEnum = 'AND_CONNECTION_TYPE' | 'OR_CONNECTION_TYPE';
    export const ConnectionTypeEnum = {
        AndConnectionType: 'AND_CONNECTION_TYPE' as ConnectionTypeEnum,
        OrConnectionType: 'OR_CONNECTION_TYPE' as ConnectionTypeEnum
    };
}


