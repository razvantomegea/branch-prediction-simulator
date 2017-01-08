# Unbiased branch prediction simulator (desktop version)
Module that detects difficult to predict (unbiased) branches implemented with Angular 2 and Electron.

## Prerequisites

Both the CLI and generated project have dependencies that require Node 4 or higher, together
with NPM 3 or higher. Download it from https://nodejs.org/en/download/

## Getting started
Make sure you have the latest versions of node and npm
Install electron globaly
`npm install -g electron`

Clone the repository, install the dependencies, and run the server
```bash
git clone -b desktop https://github.com/razvantomegea/branch-prediction-simulator.git
cd branch-prediction-simulator
npm install
npm start
```

## Packaging
To package the application for production to specific platforms, use the electron-packager
Install the electron packager globally by `npm install -g electron-packager`, then type `electron-packager . unbiased-branch-predictor --platform=win32 --arch=x64` for Windows x64. If you want to package it for other platforms, visit (Electron-packagare API Docs [https://github.com/electron-userland/electron-packager/blob/master/docs/api.md]
To package to all platforms, type `electron-packager . unbiased-branch-predictor --platform=all --arch=all`