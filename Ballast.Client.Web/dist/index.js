"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var ballast_client_1 = require("ballast-client");
var bootstrapper = new ballast_client_1.BallastBootstrapper(document)
    .bootstrapAsync()
    .then(function (client) { return console.log('ballast loaded!'); })
    .catch(function (error) { return console.log('error loading ballast: ' + error.message); });
//# sourceMappingURL=index.js.map