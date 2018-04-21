import 'reflect-metadata';
import { BallastBootstrapper } from 'ballast-client';

let server = window.location.href.substring(0, window.location.href.length - 1);
let bootstrapper = new BallastBootstrapper(document)
    .bootstrapAsync(server)
    .then(client => console.log('ballast loaded!'))
    .catch((error: Error) => console.log('error loading ballast: ' + error.message));