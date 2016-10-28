# branch-prediction-simulator
Module that detects difficult to predict branches implemented with Angular 2.

## Prerequisites

Both the CLI and generated project have dependencies that require Node 4 or higher, together
with NPM 3 or higher. Download it from https://nodejs.org/en/download/

## Getting started
Make sure you have the latest versions of node and npm
If you have installed angular-cli
```bash
npm uninstall -g angular-cli
npm cache clean
npm install -g angular-cli@latest
```
Clone the repository, install the dependencies, and run the server
```bash
git clone https://github.com/razvantomegea/branch-prediction-simulator.git
cd branch-prediction-simulator
npm install
ng serve
```

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.