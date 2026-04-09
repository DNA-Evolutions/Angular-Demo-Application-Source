# TourOptimizer Angular Demo - Application Summary

## Overview

An Angular demo application for **DNA Evolutions' JOpt.TourOptimizer** - a tour optimization REST API. The app provides a map-based UI to configure optimization inputs (nodes, resources, constraints), run optimizations against the TourOptimizer backend, and visualize results on a Leaflet map with real-time progress tracking via Server-Sent Events.

- **Live Demo:** https://demo.dna-evolutions.com/
- **Docker Hub:** `dnaevolutions/jopt_demoapplication`
- **API Docs:** https://dna-evolutions.com/api/

## Versions

| Dependency | Version |
|---|---|
| Angular | 21.2.7 |
| Angular Material / CDK | 21.2.5 |
| TypeScript | 5.9.3 |
| RxJS | 7.8.2 |
| Leaflet | 1.9.4 |
| Bootstrap | 5.3.8 |
| ngx-charts | 20.5.0 |
| zone.js | 0.16.1 |
| Node (Docker) | 22.12-alpine |
| nginx (Docker) | 1.27.4-alpine |

**App version:** 3.0.0-alpine
**TourOptimizer spec version:** 1.3.5-SNAPSHOT

## Project Structure

```
touroptimizer-angular-demo/
├── src/
│   ├── app/
│   │   ├── app.component.ts              # Root component
│   │   ├── app.module.ts                 # Main module (22 components, 3 pipes)
│   │   ├── app-routing.module.ts         # Routes: /consent, /example
│   │   ├── _services/
│   │   │   ├── optimization-wrapper/     # Core optimization orchestration
│   │   │   ├── optimization-event/       # SSE progress/warning streams
│   │   │   ├── load-example-data/        # Loads precoded example inputs
│   │   │   ├── geo-and-routing/          # Geolocation & routing logic
│   │   │   └── leaflet-map/
│   │   │       ├── marker/               # Map marker management
│   │   │       ├── polyline/             # Route polylines on map
│   │   │       └── pop-up/               # Map popup dialogs
│   │   ├── component/
│   │   │   ├── consent/                  # Cookie/consent page
│   │   │   ├── introduction/             # Intro panel, howto & video dialogs
│   │   │   ├── example/                  # Main example view
│   │   │   ├── leaflet-map/              # Leaflet map component
│   │   │   ├── optimization-run/         # Prepare, run & progress dialogs
│   │   │   ├── optimization-events/      # Progress component (SSE)
│   │   │   ├── optimization-elements/    # Node, resource, result dialogs
│   │   │   ├── optimization-elements-selector/  # Element selectors
│   │   │   └── custom-date-time-picker/  # Date/time picker component
│   │   └── pipe/
│   │       ├── date/                     # DateFormatPipe
│   │       ├── duration/                 # DurationFormatPipe
│   │       └── distance/                 # DistanceFormatPipe
│   ├── assets/
│   │   ├── env.js / env.template.js      # Runtime environment config
│   │   └── precoded-data/                # Example optimization inputs
│   ├── environments/
│   │   ├── environment.ts                # Dev: localhost:8081
│   │   └── environment.prod.ts           # Prod: Azure endpoint
│   └── index.html, main.ts, polyfills.ts, styles.css
├── build/
│   └── openapi/                          # Auto-generated API client
│       ├── api.module.ts                 # ApiModule
│       ├── api/
│       │   ├── optimization.service.ts   # Optimization API calls
│       │   └── stream.service.ts         # SSE streaming API
│       └── model/                        # ~150 TypeScript model interfaces
├── Dockerfile                            # Multi-stage: node -> nginx
├── angular.json                          # Angular CLI config (port 5000)
├── tsconfig.json                         # TS config with path aliases
├── bitbucket-pipelines.yml               # CI/CD: Docker build & push
└── package.json
```

## Key Architecture

### API Communication

The app communicates with the JOpt.TourOptimizer REST API via auto-generated OpenAPI TypeScript client (`build/openapi/`). The API spec is fetched from the TourOptimizer Swagger endpoint and models are generated via:

```bash
npm run generate:api
# Uses: openapi-generator-cli generate -g typescript-angular -i ../openapi/touroptimizer_spec.json -o ./build/openapi
```

**Base path** is configured via `BASE_PATH` provider using environment variables (`host:port`).

### Optimization Flow

1. **Load example data** via `LoadExampleDataService` (APP_INITIALIZER)
2. **Configure** nodes and resources on the Leaflet map
3. **Run optimization** via `OptimizationWrapperService`:
   - Health check (`GET /actuator/health`)
   - Start run (`POST /api/v1/runs`) -> returns `runId`
   - Subscribe to progress via SSE (`EventSource` on `/api/v1/runs/{runId}/stream/progress`)
   - Wait for result (`GET /api/v1/runs/{runId}/result`)
4. **Display results** on map with route polylines and result dialogs

### Real-time Progress

Uses native browser `EventSource` API (Server-Sent Events) wrapped in RxJS Observables via `EventSourceService`. Progress updates stream to `ProgressComponent` showing algorithm name, percentage, and current cost.

### Runtime Configuration

Environment variables can be injected at runtime via `window["env"]` (populated by `assets/env.js`). In Docker, `envsubst` processes `env.template.js` with:
- `JOPT_SWAGGER_HOST` (default: `http://localhost`)
- `JOPT_SWAGGER_PORT` (default: `8081`)
- `INPRODUCTION` (default: `false`)

Cloud IDE environments (Stackblitz, CodeSandbox, Gitpod) are auto-detected and default to the public API at `https://swagger.dna-evolutions.com:443`.

## Running the App

### With Docker (recommended)

```bash
docker run -d --rm --name myJOptDemo -p 3000:80 \
  -e JOPT_SWAGGER_HOST="http://localhost" \
  -e JOPT_SWAGGER_PORT="8081" \
  dnaevolutions/jopt_demoapplication
```

Then open http://localhost:3000.

### Without Docker

```bash
npm install
ng serve          # Dev server at http://localhost:5000
npm run build     # Production build to dist/
```

Requires a running JOpt.TourOptimizer instance (default: `http://localhost:8081`).

## CI/CD

**Bitbucket Pipelines** builds and pushes Docker images on git tags:
1. `npm ci` + extract version from `package.json`
2. Docker build & push to `dnaevolutions/jopt_demoapplication:{version}` and `:latest`
