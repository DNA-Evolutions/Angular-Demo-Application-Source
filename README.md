# TouroptimizerAngularDemo

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).



## TODO
- Priority of zero leads to serilaization error in core! => FIX CORE
- Check health of swagger before start => APP
- Fix progress observable => APP
- Typos in app
- Switch cancel start positions
- Scrolling: Always show "close"
- Show violations on Route-Level
- Max working hours: Wrong label
- TimeZone(?) Bug => Setting openingHours is saved incorrectly




## DOCKER
Using: https://dev.to/usmslm102/containerizing-angular-application-for-production-using-docker-3mhi

Start locally: docker run -d -v ${PWD}:/usr/src/app -p 3000:80 --name test --rm faja:latest

Open: http://localhost:3000/

TODO: Composing => use https://mherman.org/blog/dockerizing-an-angular-app/

## Env with docker

Setting the swagger host and the swagger port.

```
docker run  
--env JOPT_SWAGGER_HOST="http://jopttouroptimizerlatest.westeurope.azurecontainer.io" 
--env JOPT_SWAGGER_PORT="8081" 
-d -v 
${PWD}:/usr/src/app 
-p 3000:80 
--name joptAngularDemoContainer 
--rm faja:latest
```
