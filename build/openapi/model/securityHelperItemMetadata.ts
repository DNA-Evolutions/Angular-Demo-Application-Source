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


/**
 * SecurityHelperItemMetadata model for encrypted data
 */
export interface SecurityHelperItemMetadata { 
    /**
     * The iv vector used for initiailization the encryption as base 64 encoded String.
     */
    iv: string;
    /**
     * The salt used for initiailization as base 64 encoded String.
     */
    salt: string;
    /**
     * The algorithm used for encryption.
     */
    encAlgo: string;
    /**
     * Secret Key Factory algorithm.
     */
    secretKeyFacAlgo: string;
    /**
     * Secret Key Factory algorithm spec.
     */
    secretKeySpecAlgo: string;
}

