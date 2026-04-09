# JOpt.TourOptimizer — Angular Demo Application

<a href="https://dna-evolutions.com/" target="_blank"><img src="https://www.dna-evolutions.com/images/dna_logo.png" width="110" title="DNA Evolutions" alt="DNA Evolutions"></a>

A map-based Angular demo application for **DNA Evolutions' JOpt.TourOptimizer** — a reactive Spring WebFlux route optimization service. Configure nodes and resources on a Leaflet map, run optimizations against the TourOptimizer REST API, and watch results appear in real time via Server-Sent Events.

- **Live demo:** [https://demo.dna-evolutions.com](https://demo.dna-evolutions.com)
- **Docker Hub:** [`dnaevolutions/jopt_demoapplication`](https://hub.docker.com/r/dnaevolutions/jopt_demoapplication)
- **Full documentation:** [dna-evolutions.com/docs/learn-and-explore/feature-guides/angular_demo_client](https://www.dna-evolutions.com/docs/learn-and-explore/feature-guides/angular_demo_client)
- **Interactive API:** [dna-evolutions.com/api](https://dna-evolutions.com/api/)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/DNA-Evolutions/Angular-Demo-Application-Source)

---

## Overview

- [What this application does](#what-this-application-does)
- [Versions](#versions)
- [Run with Docker (recommended)](#run-with-docker-recommended)
- [Run without Docker](#run-without-docker)
- [Build a custom image](#build-a-custom-image)
- [Regenerate TypeScript models](#regenerate-typescript-models)
- [Project structure](#project-structure)
- [Further links](#further-links)

---

## What this application does

<img src="https://dna-evolutions.com/wp-content/uploads/2020/11/how-to-video-prev.gif" width="500"
title="Angular Demo Application Preview" alt="Angular Demo Application Preview">

The demo walks through a complete JOpt optimization cycle:

1. Load precoded example data or place nodes and resources freely on the map.
2. Configure optimization options (time windows, capacities, constraints).
3. Submit the optimization via `POST /api/v1/runs` and receive a `runId`.
4. Stream live progress updates via SSE (`GET /api/v1/runs/{runId}/stream/progress`).
5. Retrieve and display the result — routes are drawn as polylines on the map with full solution details.

A video walkthrough is available on YouTube:

<a href="https://www.youtube.com/watch?v=2q7cYYArKm8" target="_blank"><img src="https://img.youtube.com/vi/2q7cYYArKm8/maxresdefault.jpg" width="500"
title="Tutorial — How to use the Demo Application" alt="Tutorial — How to use the Demo Application"></a>

---

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
| Node (Docker build) | 22.12-alpine |
| nginx (Docker runtime) | 1.27.4-alpine |

**App version:** 3.0.0-alpine  
**Compatible with TourOptimizer spec:** 1.3.5-SNAPSHOT or higher

### Changelog

**April 2026:** Updated to Angular 21.2. Compatible with TourOptimizer 1.3.5+.

**February 2026:** Updated to Angular 21.1. Multiple dependency upgrades.

**January 2025:** Updated to Angular 19.1. Compatible with TourOptimizer 1.3.0+.

**July 2024:** Updated to Angular 18. Compatible with TourOptimizer 1.2.7+.

**January 2024:** Updated to Angular 17. Compatible with TourOptimizer 1.2.6+. Added free-moving example — nodes and resources can be repositioned via drag and drop.

---

## Run with Docker (recommended)

Docker is the fastest way to get started — no Node.js or Angular CLI installation required.

### Prerequisites

- Docker installed and available in your terminal.
- A running JOpt.TourOptimizer instance. Start one with:

```bash
docker run -d --rm --name jopt-touroptimizer \
  -p 8081:8081 \
  -e SPRING_PROFILES_ACTIVE=cors \
  dnaevolutions/jopt_touroptimizer:latest
```

The `cors` profile is required so the browser can reach the optimizer from the demo app.

### Start the demo application

```bash
docker run -d --rm \
  --name jopt-demo \
  -p 3000:80 \
  -e JOPT_SWAGGER_HOST="http://localhost" \
  -e JOPT_SWAGGER_PORT="8081" \
  dnaevolutions/jopt_demoapplication
```

Then open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `JOPT_SWAGGER_HOST` | `http://localhost` | Base URL of the TourOptimizer instance. |
| `JOPT_SWAGGER_PORT` | `8081` | Port of the TourOptimizer instance. |
| `INPRODUCTION` | `false` | When `true`, the app uses the public DNA Evolutions endpoint. Avoid in production — the public endpoint limits requests and enforces a 20-element cap regardless of your license. |

### Run both containers on the same Docker network

If TourOptimizer is also running in Docker, use a shared network instead of relying on `localhost`:

```bash
docker network create jopt-network

docker run -d --rm --name jopt-touroptimizer \
  --network jopt-network \
  -e SPRING_PROFILES_ACTIVE=cors \
  dnaevolutions/jopt_touroptimizer:latest

docker run -d --rm \
  --name jopt-demo \
  --network jopt-network \
  -p 3000:80 \
  -e JOPT_SWAGGER_HOST="http://jopt-touroptimizer" \
  -e JOPT_SWAGGER_PORT="8081" \
  dnaevolutions/jopt_demoapplication
```

---

## Run without Docker

### Prerequisites

1. [Node.js / npm](https://www.npmjs.com/get-npm) installed.
2. [Angular CLI](https://angular.io/cli) installed: `npm install -g @angular/cli`
3. A running TourOptimizer instance (see [prerequisites](#prerequisites) above).

### Serve locally

```bash
npm install
ng serve
```

Open [http://localhost:5000](http://localhost:5000). The default port is `5000` and can be changed in `angular.json`.

The TourOptimizer endpoint is configured in `src/environments/environment.ts` (development) and `src/environments/environment.prod.ts` (production) under the `host` and `port` keys.

---

## Build a custom image

Modify the source code in your IDE, then build and run your own Docker image:

```bash
# Build (requires at least 4 GB of RAM for the Node.js build stage)
docker build -t jopt-demo-custom .

# Run
docker run -d --rm \
  --name jopt-demo-custom \
  -p 3000:80 \
  -e JOPT_SWAGGER_HOST="http://localhost" \
  -e JOPT_SWAGGER_PORT="8081" \
  jopt-demo-custom
```

Open [http://localhost:3000](http://localhost:3000).

---

## Regenerate TypeScript models

The TypeScript API client in `build/openapi/` is generated from the TourOptimizer OpenAPI spec using the [OpenAPI Generator CLI](https://www.npmjs.com/package/@openapitools/openapi-generator-cli).

### Get the spec file

Download the cleaned spec from your running TourOptimizer:

```bash
curl http://localhost:8081/v3/api-docs -o ../openapi/touroptimizer_spec.json
```

Or use the pre-cleaned version from GitHub:
[Java-REST-Client-Examples — touroptimizer_spec_cleaned.json](https://github.com/DNA-Evolutions/Java-REST-Client-Examples/tree/master/src/main/resources/swagger/touroptimizer/spec/touroptimizer_spec_cleaned.json)

Save it as `touroptimizer_spec.json` in a folder called `openapi` **next to** (not inside) the project directory:

```
parent-directory/
├── openapi/
│   └── touroptimizer_spec.json
└── Angular-Demo-Application-Source/   ← project root
    └── package.json
```

### Run the generator

```bash
npm run generate:api
```

This runs:

```bash
openapi-generator-cli generate \
  -g typescript-angular \
  -i ../openapi/touroptimizer_spec.json \
  -o ./build/openapi
```

The generator can also be run as a Docker container or Maven dependency — see the [OpenAPI Generator documentation](https://openapi-generator.tech/docs/installation).

---

## Project structure

```
touroptimizer-angular-demo/
├── src/
│   ├── app/
│   │   ├── _services/
│   │   │   ├── optimization-wrapper/     # Core optimization orchestration
│   │   │   ├── optimization-event/       # SSE progress and warning streams
│   │   │   ├── load-example-data/        # Precoded example inputs
│   │   │   ├── geo-and-routing/          # Geolocation and routing logic
│   │   │   └── leaflet-map/              # Map marker, polyline, popup services
│   │   ├── component/
│   │   │   ├── consent/                  # Cookie consent page
│   │   │   ├── introduction/             # Intro panel, how-to and video dialogs
│   │   │   ├── example/                  # Main example view
│   │   │   ├── leaflet-map/              # Leaflet map component
│   │   │   ├── optimization-run/         # Prepare, run and progress dialogs
│   │   │   ├── optimization-events/      # Live progress component (SSE)
│   │   │   ├── optimization-elements/    # Node, resource and result dialogs
│   │   │   ├── optimization-elements-selector/
│   │   │   └── custom-date-time-picker/
│   │   └── pipe/
│   │       ├── date/                     # DateFormatPipe
│   │       ├── duration/                 # DurationFormatPipe
│   │       └── distance/                 # DistanceFormatPipe
│   ├── assets/
│   │   ├── env.js / env.template.js      # Runtime environment config (envsubst)
│   │   └── precoded-data/                # Example optimization inputs
│   └── environments/
│       ├── environment.ts                # Dev: localhost:8081
│       └── environment.prod.ts           # Prod: Azure endpoint
├── build/
│   └── openapi/                          # Auto-generated TypeScript API client
│       ├── api/
│       │   ├── optimization.service.ts   # Optimization API calls
│       │   └── stream.service.ts         # SSE streaming API
│       └── model/                        # ~150 TypeScript model interfaces
├── Dockerfile                            # Multi-stage: node build → nginx serve
├── angular.json                          # Angular CLI config (dev port: 5000)
└── package.json
```

---

## Further links

### Documentation

- [Full demo application guide](https://www.dna-evolutions.com/docs/learn-and-explore/feature-guides/angular_demo_client)
- [Getting started](https://www.dna-evolutions.com/docs/getting-started)
- [Special features overview](https://dna-evolutions.com/docs/learn-and-explore/special/special_features)
- [Interactive API testing](https://dna-evolutions.com/api/)
- [Official JavaDocs](https://public.javadoc.dna-evolutions.com)

### Code and registry

- [TourOptimizer Docker repository](https://github.com/DNA-Evolutions/Docker-REST-TourOptimizer)
- [Java REST client examples](https://github.com/DNA-Evolutions/Java-REST-Client-Examples)
- [DNA Nexus repository](https://nexus.dna-evolutions.net)

### Evaluation license

Get an extended free license designed for small businesses and customers evaluating the product:  
[DNA Evolutions Portal](https://www.dna-evolutions.com/portal) *(sign-in required)*

### Social

- [LinkedIn](https://www.linkedin.com/company/dna-evolutions/)
- [Docker Hub](https://hub.docker.com/u/dnaevolutions)
- [YouTube tutorials](https://www.youtube.com/channel/UCzfZjJLp5Rrk7U2UKsOf8Fw)
- [SourceForge](https://sourceforge.net/software/product/JOpt.TourOptimizer/)

---

## Contact

For help or questions reach us at [www.dna-evolutions.com/contact](https://www.dna-evolutions.com/contact) or [info@dna-evolutions.com](mailto:info@dna-evolutions.com).

---

## Agreement

For license terms and plans please visit [www.dna-evolutions.com](https://www.dna-evolutions.com).

---

A product by [DNA Evolutions GmbH](https://www.dna-evolutions.com) &copy;