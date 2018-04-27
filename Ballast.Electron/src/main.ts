import { ClientHost } from './client-host';

let app = new ClientHost({ 
    contentRootDirectory: './dist',
    startPage: 'index.html',
    displayMenu: true,
    displayDev: false,
    height: 864,
    width: 1536
});