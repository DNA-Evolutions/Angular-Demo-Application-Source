// Detect known cloud IDEs by hostname
const hostname = window.location.hostname;

const isStackblitz =
  hostname.includes('stackblitz.io') || hostname.includes('webcontainer.io');

const isCodesandbox =
  hostname.includes('codesandbox.io') || hostname.includes('csb.app');

const isGitpod =
  hostname.includes('gitpod.io') || hostname.endsWith('.gitpod.io');

// Default values
let host = window["env"]?.["host"] || "http://localhost";
let port = window["env"]?.["port"] || "8081";

// Override host/port based on environment
if (isStackblitz) {
  host = "https://swagger.dna-evolutions.com";
  port = "443";
} else if (isCodesandbox) {
  host = "https://swagger.dna-evolutions.com";
  port = "443";
} else if (isGitpod) {
  host = "https://swagger.dna-evolutions.com";
  port = "443";
}

export const environment = {
  production: window["env"]?.["inproduction"] || false,
  host,
  port,
  apiProgress: '/api/optimize/stream/progress',
  apiWarning: '/api/optimize/stream/warning',
  health: '/actuator/health',
  exampleAssertHelperPath: './assets/precoded-data/example-asserts-helper.json',
  howtoYTIdent: '2q7cYYArKm8',
  introYTIdent: 'U4mDQGnZGZs',
  showConsentPage: window["env"]?.["showConsentPage"] ?? true,
};