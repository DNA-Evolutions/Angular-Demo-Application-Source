## From Scratch (Help and Hints)

This document can be seen as a collection of helpful steps and commands to set up an Angular Project
with OpenApiGenerator support. However, it does **NOT** contain a full walkthrough on how to set up Angular Projects in general.

---

#### Helpful links
- <a href="https://angular.io/cli" target="_blank">Angular CLI</a>
- <a href="https://www.npmjs.com/package/@openapitools/openapi-generator-cli" target="_blank">Open Api Generator</a>
- <a href="https://www.mokkapps.de/blog/how-to-generate-angular-and-spring-code-from-open-api-specification/" target="_blank">Generate Angular and Spring code from OpenApi</a>
- <a href="https://material.angular.io/" target="_blank">Angular Material</a>


---

## Install enviroment
```xml
npm install -g @angular/cli
npm install @openapitools/openapi-generator-cli -g
npm install --save  @angular-material-components/datetime-picker
```

### Go to a main-folder, and create the project
```xml
ng new touroptimizer-angular-demo
```

### Open the folder
```xml
cd touroptimizer-angular-demo
```

### OpenAPI generator CLI needs to be added as npm dependency:
```
npm add @openapitools/openapi-generator-cli
ng add @angular/material
```

### Follow tutorial from www.mokkapps.de to adjust package.json and add schema.yaml definition like described

### Build/serve the project
```xml
ng build
```
```xml
ng serve
```

### From angular project folder to update models based on schema.yaml
```xml
npm run generate:api
```
## Agreement
For reading our license agreement and for further information about license plans, please visit <a href="https://www.dna-evolutions.com" target="_blank">www.dna-evolutions.com</a>.

--- 

## Authors
A product by [dna-evolutions ](https://www.dna-evolutions.com)&copy;

