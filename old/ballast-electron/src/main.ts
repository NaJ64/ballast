import { Host } from './host';

let app = new Host({ 
    contentRootDirectory: './dist',
    startPage: 'index.html',
    displayMenu: true,
    displayDev: true,
    height: 864,
    width: 1536
});