import { AppHost } from './app-host';

let appHost = new AppHost({ 
    contentRootDirectory: './dist',
    startPage: 'index.html',
    displayMenu: true,
    displayDev: false,
    height: 864,
    width: 1536
});