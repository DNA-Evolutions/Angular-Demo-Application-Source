export const environment = {
  production: window["env"]["inproduction"] || false,
  host: window["env"]["host"] || "http://localhost",
  port: window["env"]["port"] || "8081",
  apiProgress: '/api/optimize/stream/progress',
  apiWarning: '/api/optimize/stream/warning',
  health: '/actuator/health',
  exampleAssertHelperPath: './assets/precoded-data/example-asserts-helper.json',
  howtoYTIdent:'2q7cYYArKm8',
  introYTIdent:'U4mDQGnZGZs',
  showConsentPage: window["env"]["showConsentPage"] || true,
};

