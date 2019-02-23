import { BallastBootstrapper as Bootstrapper } from "ballast-ui";

let serverUrl = window.location.origin;
let bootstrapper = new Bootstrapper(document)
    .bootstrapAsync(serverUrl)
        .then(client => client.startAsync())
        .then(() => console.log('ballast loaded!'))
        .catch((error: Error) => console.log('error loading ballast: ' + error.message));