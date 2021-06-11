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
 * The list of optimizationOptions
 */
export interface OptimizationOptions { 
    /**
     * The properties of the Optimization run. For example, the number of iterations for the Optimization run or the weight for certain Optimization goals can be defined.
     */
    properties: { [key: string]: string; };
}
