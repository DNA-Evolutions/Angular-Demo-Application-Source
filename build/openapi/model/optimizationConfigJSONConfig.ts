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
import { OptimizationOptions } from './optimizationOptions';
import { CoreBuildOptions } from './coreBuildOptions';
import { NodeRelation } from './nodeRelation';
import { Node } from './node';
import { Resource } from './resource';
import { ElementConnection } from './elementConnection';
import { Solution } from './solution';


export interface OptimizationConfigJSONConfig { 
    /**
     * An optional title/ident for the run. If not provided, a generated ident will be used
     */
    ident?: string;
    /**
     * The list of nodes
     */
    nodes: Array<Node>;
    /**
     * The list of resoruces
     */
    resources: Array<Resource>;
    /**
     * The list of relations
     */
    nodeRelations: Array<NodeRelation>;
    /**
     * The list of connections
     */
    elementConnections: Array<ElementConnection>;
    optimizationOptions: OptimizationOptions;
    coreBuildOptions?: CoreBuildOptions;
    solution?: Solution;
    /**
     * The extension of the configuration. For example, to provide a license.
     */
    extension?: object;
}
