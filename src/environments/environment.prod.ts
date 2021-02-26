export const environment = {
  production: window["env"]["inproduction"] || true,
  host: window["env"]["host"] || "https://dna-swagger.azurewebsites.net",
  port: window["env"]["port"] || "443",
  apiProgress: '/api/optimization/stream/progress',
  apiWarning: '/api/optimization/stream/warning',
  health: '/actuator/health',
  exampleAssertHelperPath: './assets/precoded-data/example-asserts-helper.json',
  howtoYTIdent:'2q7cYYArKm8',
  introYTIdent:'U4mDQGnZGZs'
};
