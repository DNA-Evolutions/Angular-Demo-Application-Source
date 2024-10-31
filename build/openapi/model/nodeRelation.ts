/**
 * DNA Evolutions - JOpt.TourOptimizer
 * This is DNA\'s JOpt.TourOptimizer service. A RESTful Spring Boot application using springdoc-openapi and OpenAPI 3. JOpt.TourOpptimizer is a service that delivers route optimization and automatic scheduling features to be easily integrated into any third-party application. JOpt.TourOpptimizer encapsulates all necessary optimization functionality and provides a comprehensive REST API that offers a domain-specific optimization interface for the transportation industry. The service is stateless and does not come with graphical user interfaces, map depiction or any databases. These extensions and adjustments are supposed to be introduced by the consumer of the service while integrating it into his/her own application. The service will allow for many suitable adjustments and user-specific settings to adjust the behaviour and optimization goals (e.g. minimizing distance, maximizing resource utilization, etc.) through a comprehensive set of functions. This will enable you to gain control of the complete optimization processes.This service is based on JOpt (7.5.1-rc2-j17)
 *
 * The version of the OpenAPI document: 1.2.8-alpha-SNAPSHOT)
 * Contact: info@dna-evolutions.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { NodeRelationType } from './nodeRelationType';


/**
 * The list of relations
 */
export interface NodeRelation { 
    /**
     * The masterNodeId
     */
    masterNodeId: string;
    /**
     * The relatedNodeIds
     */
    relatedNodeIds: Array<string>;
    type: NodeRelationType;
    /**
     * The relationMode
     */
    relationMode?: NodeRelation.RelationModeEnum;
}
export namespace NodeRelation {
    export type RelationModeEnum = 'STRONG' | 'WEAK' | 'WEAK_TO_MATER' | 'WEAK_TO_RELATED';
    export const RelationModeEnum = {
        Strong: 'STRONG' as RelationModeEnum,
        Weak: 'WEAK' as RelationModeEnum,
        WeakToMater: 'WEAK_TO_MATER' as RelationModeEnum,
        WeakToRelated: 'WEAK_TO_RELATED' as RelationModeEnum
    };
}


