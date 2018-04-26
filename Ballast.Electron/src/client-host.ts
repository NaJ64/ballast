import { app, BrowserWindow, protocol, Menu, MenuItem } from 'electron';
import * as path from 'path';
import * as url from 'url';

export interface ClientHostOptions {
    displayDev: boolean;
    displayMenu: boolean;
    width: number;
    height: number;
}

export class ClientHost {

    private win!: Electron.BrowserWindow | null;
    private options: ClientHostOptions;
    private contentRootPath: string;
    private indexHtml: string;

    public constructor(options: ClientHostOptions) {

        // save options
        this.options = options;
        this.contentRootPath = path.resolve('dist'); //this.resolvePackageContentRoot('ballast-client') || "";
        this.indexHtml = this.resolvePackageIndexHtml(this.contentRootPath) || "";

        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        app.on('ready', () => {

            // create new menu for app
            this.createMenu();

            // create new window (start app)
            this.createWindow();

            // intercept file request protocol
            protocol.interceptFileProtocol('file', (request, callback) => {

                // Create a new path to return 
                let requestedFilePath = request.url;

                // // Prepend the server url
                // requestedFilePath = this.options.server + requestedFilePath.substring(15);

                // Update/transform file path requested
                requestedFilePath = this.transformFileUrlToFilePath(request.url);

                // Make sure the file is being requested from the content root
                if (!requestedFilePath.toLowerCase().startsWith(this.contentRootPath.toLowerCase())) {
                    requestedFilePath = this.contentRootPath + '\\' + requestedFilePath.substring(3);
                }

                // Return the file path
                callback(requestedFilePath);

            }, (err) => {
                if (err) console.error('Failed to register replacement file protocol')
            })

        });

        // Quit when all windows are closed.
        app.on('window-all-closed', () => {
            // On macOS it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') {
                app.quit();
            }
        })

        app.on('activate', () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (this.win === null) {
                this.createWindow();
            }
        })

    }

    private transformFileUrlToFilePath(fileUrl: string): string {
        return path.resolve(decodeURI(fileUrl.substr(8)));
    }

    private transformFilePathToFileUrl(filePath: string): string {
        return encodeURI(url.format({
            pathname: path.resolve(filePath),
            protocol: 'file:',
            slashes: true
        }));
    }

    private createWindow(): Electron.BrowserWindow {

        // Create the browser window.
        this.win = new BrowserWindow({
            width: this.options.width,
            height: this.options.height,
            autoHideMenuBar: !this.options.displayMenu
        });

        // and load the index.html of the app.
        this.win.loadURL(url.format({
            pathname: this.indexHtml,
            protocol: 'file:',
            slashes: true
        }));

        // Open the DevTools.
        if (this.options.displayDev) {
            this.win.webContents.openDevTools();
        }

        // Emitted when the window is closed.
        this.win.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            this.win = null;
        });

        return this.win;

    }

    private createMenu(): Electron.Menu {
        const menuTemplate: Electron.MenuItemConstructorOptions[] = [
            {
                label: 'File',
                submenu: [
                    {
                        label: 'Quit',
                        click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Event) => {
                            app.quit();
                        }
                    }
                ]
            } as Electron.MenuItemConstructorOptions
        ];

        let applicationMenu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(applicationMenu);
        return applicationMenu;
    }

    private resolvePackageContentRoot(packageName: string): string | undefined {
        let packageMain = path.resolve(require.resolve(packageName));
        let distFolderPath = path.dirname(packageMain);
        return path.resolve(distFolderPath);
    }

    private resolvePackageIndexHtml(contentRoot: string): string | undefined {
        if (!contentRoot || contentRoot == "")
            return "";
        return path.resolve(path.join(contentRoot, 'index.html'));
    }

}