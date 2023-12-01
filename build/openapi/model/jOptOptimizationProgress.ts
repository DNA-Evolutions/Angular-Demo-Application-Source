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


/**
 * JOptOptimizationProgress model for the documentation
 */
export interface JOptOptimizationProgress { 
    /**
     * The obejct id. Will be filled out by the optimizer, if necessary
     */
    id?: string;
    /**
     * An id related to the creator that is filled out autmatically
     */
    creator?: string;
    /**
     * The ident of the currently running optimization
     */
    ident: string;
    /**
     * The id of the currently running optimization algorithm
     */
    callerId: string;
    /**
     * The progress in percentage of the currently running optimization algorithm
     */
    curProgress: number;
    /**
     * The current cost of the currently running optimization algorithm
     */
    curCost: number;
    /**
     * The stage of the optimization. The first running algorithm will get the stage 0.
     */
    stage: number;
    /**
     * The progress as human readable description
     */
    desc: string;
    /**
     * Optional value that will be used for database cleanup purposes.
     */
    expireAt?: string;
}

