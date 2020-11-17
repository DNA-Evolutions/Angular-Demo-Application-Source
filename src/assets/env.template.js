(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["host"] = "${JOPT_SWAGGER_HOST}";
  window["env"]["port"] = "${JOPT_SWAGGER_PORT}";
})(this);
