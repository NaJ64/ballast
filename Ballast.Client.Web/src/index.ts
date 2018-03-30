import 'reflect-metadata';
import { BallastBootstrapper } from 'ballast-client';

let bootstrapper = new BallastBootstrapper(document)
    .bootstrapAsync()
    .then(client => console.log('ballast loaded!'))
    .catch((error: Error) => console.log('error loading ballast: ' + error.message));