export const environment = {
  production: true,
  host: window["env"]["host"] || "https://joptswaggerapplication.westeurope.azurecontainer.io",
  port: window["env"]["port"] || "443",
  apiProgress: '/api/optimization/stream/progress',
  apiWarning: '/api/optimization/stream/warning',
  health: '/actuator/health',
  exampleAssertHelperPath: './assets/precoded-data/example-asserts-helper.json',
};
