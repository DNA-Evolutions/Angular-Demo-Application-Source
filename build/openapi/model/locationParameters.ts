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
 * Location parameters that can support geographical routing.
 */
export interface LocationParameters { 
    /**
     * The layers in which the location can be detected. Use \'auto\' for automatically selecting the best (highest confidence) layer.
     */
    layers?: string;
    /**
     * The number of layers the location can be related to. Further, in case of a query the number of results that might be found/desired.
     */
    size?: number;
    /**
     * The number of meters about this input location within which edges (roads between intersections) will be considered as candidates for said location. When correlating this location to the route network, try to only return results within this distance (meters) from this location. If there are no candidates within this distance it will return the closest candidate within reason. If this value is larger than the configured service limit it will be clamped to that limit. The default is 20 meters.
     */
    radius?: number;
    /**
     * If you use the sources parameter, you can choose which of these data sources to include in your search. So if you\'re only interested in finding an address in data from OpenAddresses, for example, you can build a query specifying that data source \'oa\'. (OpenAddresses=\'oa\', OpenstreetMap = \'osm\', Who\'s on First =\'wof\',GeoNames=\'gn\' ). If, for example, OpenAddresses and OpenstreetMap is desired use \'osm,oa\'. Default is \'all\' 
     */
    sources?: string;
}

