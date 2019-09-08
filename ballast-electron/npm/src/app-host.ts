import { BrowserWindow, Menu, app, protocol, MenuItemConstructorOptions } from "electron";
import * as path from "path";
import * as url from "url";

export interface IAppHostOptions { 
    contentRootDirectory: string;
    startPage: string;
    displayDev: boolean;
    displayMenu: boolean;
    width: number;
    height: number;
}

export class AppHost {

    //private readonly _menu: Menu;
    private readonly _contentRoot: string;
    private readonly _startPage: string;
    private readonly _winHeight: number;
    private readonly _winWidth: number;
    private readonly _showMenu: boolean;
    private readonly _showDev: boolean;
    private _win?: BrowserWindow | null;

    public constructor(options: IAppHostOptions) {
        // Save options/defaults
        this._contentRoot = path.resolve(options.contentRootDirectory);
        this._startPage = this._contentRoot && path.resolve(path.join(this._contentRoot, options.startPage)) || "";
        this._showDev = options.displayDev;
        this._showMenu = options.displayMenu;
        this._winHeight = options.height;
        this._winWidth = options.width;
        // Create a menu to use when spawning browser window(s)
        this.createMenu(); //this._menu = this.createMenu();
        // Hook into electron app lifecycle
        app.on("ready", this.onAppReady.bind(this));
        app.on("activate", this.onAppActivate.bind(this));
        app.on("window-all-closed", this.onAppWindowAllClosed.bind(this));
    }

    private createMenu(): Menu {
        const menuTemplate: MenuItemConstructorOptions[] = [{
            label: "File",
            submenu: [
                {
                    label: "Quit",
                    click: () => {
                        app.quit();
                    }
                }
            ]
        }];
        let applicationMenu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(applicationMenu);
        return applicationMenu;
    }
    
    private createWindow(): BrowserWindow {
        // Create a browser window
        let win = new BrowserWindow({
            width: this._winWidth,
            height: this._winHeight,
            autoHideMenuBar: !this._showMenu
        });
        // Load start page ("index.html")
        win.loadURL(url.format({
            pathname: this._startPage,
            protocol: 'file:',
            slashes: true
        }));
        // Open DevTools
        if (this._showDev) {
            win.webContents.openDevTools();
        }
        // Return the new browser window
        return win;
    }

    private onAppReady() {

        // Create a new window
        this._win = this.createWindow();
        // Handle closed event (so we can deference browser window)
        this._win.on("closed", this.onBrowserWindowClosed.bind(this));
    
        // Convert file protocol url requests to fs path
        protocol.interceptFileProtocol("file", (request, callback) => {
            // Transform the url
            let requestedFilePath = request.url;
            requestedFilePath = path.resolve(decodeURI(requestedFilePath.substr(8)));
            // Make sure the file is being requested from the content root
            if (!requestedFilePath.toLowerCase().startsWith(this._contentRoot.toLowerCase())) {
                requestedFilePath = this._contentRoot + '\\' + requestedFilePath.substring(3);
            }
            // Return the fs path
            callback(requestedFilePath);
        }, err => {
            if (err) {
                console.log("Failed to register replacement file protocol");
            }
        });

    }

    private onAppActivate() {
        // Create a new window if closed
        if (!this._win) {
            this._win = this.createWindow();
            // Handle closed event (so we can deference browser window)
            this._win.on("closed", this.onBrowserWindowClosed.bind(this));
        }
    }

    private onAppWindowAllClosed() {
        // If not on a mac, quit the app
        if (process.platform !== "darwin") {
            app.quit();
        }
    }

    private onBrowserWindowClosed() {
        // Dereference the browser window
        this._win = null;
    }

}