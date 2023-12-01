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
 * The nodeViolations. The violations collected at the element/node. For example, lateViolation, early violation etc.
 */
export interface Violation { 
    /**
     * The value is a violation specfic value. For example, if the violation is of subAttribute \'LATE\', the value contains the late violation value in minutes.
     */
    value: string;
    /**
     * The description of the violation. A human readable description of the violation
     */
    desc: string;
    /**
     * The category of the violation. The main category of the violation.
     */
    category: string;
    /**
     * The attribute is further defining the type of the violation. For example, late and early violation belong to the attribute \'TIMECONSTRAINT\'.
     */
    attribute: string;
    /**
     * The subAttribute defines what kind of violation we are dealing with.
     */
    subAttribute: string;
    /**
     * The code is the unique code for each Violation type.
     */
    code: number;
}

