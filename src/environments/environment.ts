export const environment = {
  production: false,
  //host: window["env"]["host"] || "http://localhost",
  host: window["env"]["host"] || "http://jopttouroptimizerlatest.westeurope.azurecontainer.io",
  port: window["env"]["port"] || "8081",
  apiProgress: '/api/optimization/stream/progress',
  apiWarning: '/api/optimization/stream/warning',
  health: '/actuator/health',
  exampleAssertHelperPath: './assets/precoded-data/example-asserts-helper.json',
};

