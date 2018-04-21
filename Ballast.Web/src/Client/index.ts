import 'reflect-metadata';
import { BallastBootstrapper } from 'ballast-client';

let server = 'http://localhost:80';
let bootstrapper = new BallastBootstrapper(document)
    .bootstrapAsync(server)
    .then(client => console.log('ballast loaded!'))
    .catch((error: Error) => console.log('error loading ballast: ' + error.message));