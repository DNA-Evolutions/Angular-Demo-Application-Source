# TourOptimizer Angular Demo Application - Source

<a href="https://dna-evolutions.com/" target="_blank"><img src="https://docs.dna-evolutions.com/indexres/dna-temp-logo.png" width="110"
title="DNA-Evolutions" alt="DNA-Evolutions"></a>

To utilize <a href="https://github.com/DNA-Evolutions/Docker-REST-TourOptimizer/blob/main/README.md#how-to-start-jopttouroptimizer-docker" target="_blank">JOptTourOptimizer-Docker</a>, we created an Angular-Demo application. This demo application is hosted on <a href="https://azure.microsoft.com/" target="_blank">Microsoft Azure</a> and is made available via <a href="https://demo.dna-evolutions.com/" target="_blank">https://demo.dna-evolutions.com</a>. Here we would like to share the latest source-code of this project. This is not a classical "Hello World" project, as it is using multiple dependencies and advanced concepts. However, feel free to explore the project and extract whatever you need to get started with JOpt.

**Update January 11th 2025:**

From now on, the Angular Demo uses Angular 19.1. We also updated/upgraded multiple other dependencies. The generated models are using JOpt.TourOptimizer with **version 1.3.0 or higher**.

**Update July 12th 2024:**

From now on, the Angular Demo uses Angular 18. We also updated/upgraded multiple other dependencies. The generated models are using JOpt.TourOptimizer with **version 1.2.7 or higher**.

**Update January 7th 2024:**

From now on, the Angular Demo uses Angular 17. We also updated/upgraded multiple other dependencies. The generated models are using JOpt.TourOptimizer with **version 1.2.6 or higher**. In addition, a "free moving example" was added. Nodes and Resources can be freely positioned via drag and drop.

**Update June 8th 2021:**

From now on, the Angular Demo uses our new swagger definition (see 
<a href="https://swagger.dna-evolutions.com/v3/api-docs/Optimize" target="_blank">swagger.dna-evolutions.com/v3/api-docs/Optimize</a>). This requires using JOpt.TourOptimizer with **version 1.0.3 or higher**. This swagger definition has the advantage that it enables almost all features of JOpt at the REST-endpoint.

**Update 21st September 2021:**
The replacement described in *Update June 2021* is no longer necessary. However, models already created need to be recreated. Further, the legacy endpoint is dropped, and the main-endpoint changed to <a href="https://swagger.dna-evolutions.com/v3/api-docs/Optimize" target="_blank">swagger.dna-evolutions.com/v3/api-docs/Optimize</a>.

---

# Contact

If you need any help, please contact us via our company website <a href="https://www.dna-evolutions.com" target="_blank">www.dna-evolutions.com</a> or write an email to <a href="mailto:info@dna-evolutions.com">info@dna-evolutions.com</a>.

---

## Further Documentation and helpful Links

Our content:
- Further documentation - <a href="https://docs.dna-evolutions.com" target="_blank">docs.dna-evolutions.com</a>
- Special features	- <a href="https://docs.dna-evolutions.com/overview_docs/special_features/Special_Features.html" target="_blank">Overview of special features</a>
- Our company website - <a href="https://www.dna-evolutions.com" target="_blank">www.dna-evolutions.com</a>
- Our official repository - <a href="https://public.repo.dna-evolutions.com" target="_blank">public.repo.dna-evolutions.com</a>
- Our official JavaDocs - <a href="https://public.javadoc.dna-evolutions.com" target="_blank">public.javadoc.dna-evolutions.com</a>
- Our YouTube channel - <a href="https://www.youtube.com/channel/UCzfZjJLp5Rrk7U2UKsOf8Fw" target="_blank">DNA Tutorials</a>
- Our DockerHub channel - <a href="https://hub.docker.com/u/dnaevolutions" target="_blank">DNA DockerHub</a>
- Our LinkedIn channel - <a href="https://www.linkedin.com/company/dna-evolutions/" target="_blank">DNA LinkedIn</a>

Third-party:
- <a href="https://angular.io/cli" target="_blank">Angular CLI</a>
- <a href="https://www.npmjs.com/package/@openapitools/openapi-generator-cli" target="_blank">Open Api Generator</a>
- <a href="https://www.mokkapps.de/blog/how-to-generate-angular-and-spring-code-from-open-api-specification/" target="_blank">Generate Angular and Spring code from OpenApi</a>
- <a href="https://material.angular.io/" target="_blank">Angular Material</a>

---

## Overview

* [General - DNA Demo Application](#general-dna-demo-application)
* [Serve with Docker (recommended)](#serve-with-docker-recommended)
* [Serve without Docker](#serve-without-docker)
* [Update/Generate the typescript models using OpenApi Generator](#update-generate-the-typescript-models-using-openapi-generator)
* [Video - How to use the Demo-Application](#video-how-to-use-the-demo-application)
* [What's next?](#what-s-next)

---

## General - DNA Demo Application

The angular-demo application was generated with <a href="https://github.com/angular/angular-cli" target="_blank">Angular CLI</a>. Further, we utilized <a href="https://github.com/OpenAPITools/openapi-generator" target="_blank">OpenApi Generator</a> to automatically create the required TypeScript models from the OpenApi definition provided from our Swagger endpoint of JOptTourOptimizer.

<img src="https://dna-evolutions.com/wp-content/uploads/2020/11/how-to-video-prev.gif" width="450"
title="DNA-Evolutions Demo Application Preview" alt="DNA-Evolutions Demo Application Preview">

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/DNA-Evolutions/Angular-Demo-Application-Source) (this takes quite a while).
Please make sure you set a valid touroptizer-application endpoint. By default it is <a href="http://localhost:8081" target="_blank">[Angular CLI](http://localhost:8081)</a>. 
You can modify the endpoint in the ``src/environments/environment.ts`` or ``src/environments/environment.prod.ts`` under the key ``host`` and ``port``.

---

## Serve with Docker (recommended)

We recommend serving the Demo Application with docker, especially when you are new to Angular. The docker build will install all the required dependencies for you. You can modify the code in your desired IDE and build your custom image.

### Prerequisites

1) Install a Docker environment and make sure ``docker`` is available in your command line.

2) Even though the Demo-Application needs no TourOptimizer to start, you need to provide a running TourOptimizer instance to test the full functionality of the Demo-Application. Please read the documentation on how to <a href="https://github.com/DNA-Evolutions/Docker-REST-TourOptimizer/blob/main/README.md#how-to-start-jopttouroptimizer-docker" target="_blank">start the TourOptimizer</a>.


### Start the image

Please visit <a href="https://hub.docker.com/repository/docker/dnaevolutions/jopt_demoapplication/general" target="_blank">https://hub.docker.com/repository/docker/dnaevolutions/jopt_demoapplication/general</a> and follow the instructions if you want to start the pre-built image without using the sources. 

### Build the image from scratch

1) Clone this repository and open it in your desired IDE (e.g. <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a>) and modify the code if you like.
2) <a href="https://docs.docker.com/engine/reference/commandline/build/" target="_blank">Build</a> the docker image using the ``Dockerfile`` in the main project path, by running:

ATTENTION: Node.js during the build process can be quite memory consuming. So make sure your docker environment has at least 4 GB of Ram. 

```xml
docker build -t dna_custom_demo_image .
```

### Run a container

1) Run the image based on your freshly created image:

```xml
docker run -d --rm \
	--name myJOptTourOptimizerDemo \
	-p 3000:80 \
	-v ${PWD}:/usr/src/app \
	-e JOPT_SWAGGER_HOST="http://localhost" \
	-e JOPT_SWAGGER_PORT="8081" \
	dna_custom_demo_image
```

Same command as a single line:

```xml
docker run -d --rm --name myJOptTourOptimizerDemo -p 3000:80 -v ${PWD}:/usr/src/app -e JOPT_SWAGGER_HOST="http://localhost" -e JOPT_SWAGGER_PORT="8081" dna_custom_demo_image
```

Open <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>, and you should see the Demo Application. If <a href="https://github.com/DNA-Evolutions/Docker-REST-TourOptimizer/blob/main/README.md#how-to-start-jopttouroptimizer-docker" target="_blank">JOptTourOptimizer</a> is not running in the background, you can **NOT** start any Optimization. However, you should see the starting page of the Demo Application. By default, the TourOptimizer is assumed to be available at <a href="http://localhost:8081" target="_blank">http://localhost:8081</a> and is started with the "cors" profile. You can adjust the default settings for host and port in the ``environment.ts`` file.

You can provide three environment variables:
* ``JOPT_SWAGGER_HOST``: The address of your running TourOptimizer. If you run the docker image of the TourOptimizer locally, this is ``http://localhost``.
* ``JOPT_SWAGGER_PORT``: The port of your running TourOptimizer. If you run the docker image of the TourOptimizer locally, this is ``8081``.
* ``INPRODUCTION``: This value is ``false`` by default. If you are changing it to ``true``, our official TourOptimizer endpoint is used by default. However, **try to avoid this**, as we are going to block IPs with too many requests. Further, our official endpoint has a limitation of 20 elements to be optimized, regardless of your license. You can change the production environment settings by editing the file: ``environment.prod.ts``.


---

## Serve without Docker

Of course, you can host the Demo-Application Angular Project locally without using docker. However, you have to make sure your environment is set up correctly.

### Prerequisites (for using ``npm`` and ``ng``)

1) First, you need to make sure <a href="https://www.npmjs.com/get-npm" target="_blank">npm (Node Package Manager)</a> is installed.   

2) Further, you need to install <a href="https://angular.io/cli" target="_blank">ng (Angular CLI)</a>

3) Even though the Demo-Application needs no TourOptimizer to start, you need to provide a running TourOptimizer instance to test the full functionality of the Demo-Application. Please read the documentation on how to <a href="https://github.com/DNA-Evolutions/Docker-REST-TourOptimizer/blob/main/README.md#how-to-start-jopttouroptimizer-docker" target="_blank">start the TourOptimizer</a>.


### Serve the Demo Application

1. Clone this repository and open it in your desired IDE (e.g. <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a>) if you like to modify the code.

2. You can serve the project by using ``ng serve`` from within the project path.

3. Open <a href="http://localhost:5000" target="_blank">http://localhost:5000</a>, and you should see the Demo Application. If <a href="https://github.com/DNA-Evolutions/Docker-REST-TourOptimizer/blob/main/README.md#how-to-start-jopttouroptimizer-docker" target="_blank">JOptTourOptimizer</a> is not running in the background, you can **NOT** start any Optimization. However, you should see the starting page of the Demo Application. By default, the TourOptimizer is assumed to be available at <a href="http://localhost:8081" target="_blank">http://localhost:8081</a> and is started with the "cors" profile. You can adjust the default settings for host and port in the ``environment.ts`` file. The default port, the Demo Application is hosted, is port 5000, you can change this behavior in the ``angular.json``.

(Please also read the <a href="https://angular.io/cli/build" target="_blank">Angular Documentation</a> to get further help on how to build projects.)


---
## Update/Generate the TypeScript models using OpenApi Generator

If you would like to automatically generate the models based on the <a href="https://swagger.dna-evolutions.com/v3/api-docs" target="_blank">latest Swagger API-Docs</a> of the
<a href="https://github.com/DNA-Evolutions/Docker-REST-TourOptimizer" target="_blank">TourOptimizer</a>, you will have to install <a href="https://www.npmjs.com/package/@openapitools/openapi-generator-cli" target="_blank">Openapi-Generator-CLI</a>.

Note: OpenApiGenerator can also be run as Docker container or Maven depedency.

### Create a touroptimizer_spec.json file
The ``touroptimizer_spec.json`` containing the API-Docs is not part of this repository. Copy and paste the Swagger definition under <a href="https://swagger.dna-evolutions.com/v3/api-docs" target="_blank">swagger.dna-evolutions.com/v3/api-docs</a> (or from <a href="http://localhost:8081/v3/api-docs" target="_blank">http://localhost:8081/v3/api-docs</a>). **Please, clean all 'oneOf' keys before using the schema.**

### Download touroptimizer_spec_cleaned.json file
 Visit <a href="https://github.com/DNA-Evolutions/Java-REST-Client-Examples/tree/master/src/main/resources/swagger/touroptimizer/spec/touroptimizer_spec_cleaned.json" target="_blank">cleaned schema on GitHub</a>) and save as a new file called ``touroptimizer_spec.json``. 

**Update June 2021:**

Native JSON is also supported from now on.

### Make the touroptimizer_spec.json available

Within the file ``package.json`` of the Demo-Application project, the script ``npm run generate:api`` is defined. It expects the ``touroptimizer_spec.json`` to be saved at ``../openapi/touroptimizer_spec.json``. Meaning, you will have to create a new folder called ``openapi`` next to your project folder (NOT inside the project folder itself) and save your ``touroptimizer_spec.json`` inside the ``openapi`` folder.

If this is done, you can call:

```xml
npm run generate:api
```

to update/generate the TypeScript models.

---

## Video - How to use the Demo-Application

Click to open video:

<a href="https://www.youtube.com/watch?v=2q7cYYArKm8 " target="_blank"><img src="https://img.youtube.com/vi/2q7cYYArKm8/maxresdefault.jpg" width="500"
title="Tutorial - How to use the Demo-Application" alt="Tutorial - How to use the Demo-Application"></a>
---

## What's next?

We are going to publish some tutorials on "how to create your own examples". Further, we are going to give some more insides on the structure of the Demo-Application.

---

## TODO's

* Improve in-code documentation.

---

## Agreement
For reading our license agreement and for further information about license plans, please visit <a href="https://www.dna-evolutions.com" target="_blank">www.dna-evolutions.com</a>.

--- 

## Authors
A product by [dna-evolutions ](https://www.dna-evolutions.com)&copy;

