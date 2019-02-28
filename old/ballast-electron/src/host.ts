import { BrowserWindow, Menu, app, protocol } from 'electron';
import * as path from 'path';
import * as url from 'url';

export interface IHostOptions {
    contentRootDirectory: string;
    startPage: string;
    displayDev: boolean;
    displayMenu: boolean;
    width: number;
    height: number;
}

export class Host {

    private win!: Electron.BrowserWindow | null;
    private options: IHostOptions;
    private contentRootDirectory: string;
    private startPage: string;

    public constructor(options: IHostOptions) {

        // save options
        this.options = options;

        // Locate the start page within the content root directory
        this.contentRootDirectory = path.resolve(this.options.contentRootDirectory); //this.resolvePackageContentRoot('ballast-client') || "";
        this.startPage = this.resolveStartPage(this.contentRootDirectory, this.options.startPage) || "";

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

                // Update/transform file path requested
                requestedFilePath = this.transformFileUrlToFilePath(request.url);

                // Make sure the file is being requested from the content root
                if (!requestedFilePath.toLowerCase().startsWith(this.contentRootDirectory.toLowerCase())) {
                    requestedFilePath = this.contentRootDirectory + '\\' + requestedFilePath.substring(3);
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
            pathname: this.startPage,
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

    private resolveStartPage(contentRoot: string, startPage: string): string | undefined {
        if (!contentRoot || contentRoot == "")
            return "";
        return path.resolve(path.join(contentRoot, startPage));
    }

}