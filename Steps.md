# Sources Overview
https://www.mokkapps.de/blog/how-to-generate-angular-and-spring-code-from-open-api-specification/
https://angular.io/cli
https://www.npmjs.com/package/@openapitools/openapi-generator-cli

# Install enviroment

## Installing Angular CLI - visit https://angular.io/cli
npm install -g @angular/cli

## Installing @openapitools/openapi-generator-cli visit https://www.npmjs.com/package/@openapitools/openapi-generator-cli
### install the latest version of "openapi-generator-cli" 
npm install @openapitools/openapi-generator-cli -g

## First, the OpenAPI generator CLI needs to be added as npm dependency:
npm add @openapitools/openapi-generator-cli


# Create an angluar project from yaml-schema definition
### Select any folder where you want to create the project and create it
ng new touroptimizer-angular-demo

### Cd into folder
cd touroptimizer-angular-demo

### Add dependcies
npm add @openapitools/openapi-generator-cli

### Follow tutorial from www.mokkapps.de to adjust package.json and add schema defintion like descibed

### Build the project
ng build




ng add @angular/material

ng serve

npm install --save  @angular-material-components/datetime-picker

## From angular project folder
npm run generate:api
