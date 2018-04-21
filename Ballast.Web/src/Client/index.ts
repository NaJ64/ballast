import 'reflect-metadata';
import { BallastBootstrapper } from 'ballast-client';

let server = window.location.hostname;
let bootstrapper = new BallastBootstrapper(document)
    .bootstrapAsync(server)
    .then(client => console.log('ballast loaded!'))
    .catch((error: Error) => console.log('error loading ballast: ' + error.message));