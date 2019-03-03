import { BallastBootstrapper } from "ballast-ui";

let serverUrl = "https://ballast.azurewebsites.net";
new BallastBootstrapper(document)
    .bootstrapAsync(serverUrl)
    .then(client => client.startAsync())
    .then(() => console.log('ballast loaded!'))
    .catch((error: Error) => console.log('error loading ballast: ' + error.message));