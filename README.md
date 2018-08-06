# ballast
Browser-based multiplayer game using ASP.NET Core, SignalR, TypeScript, and three.js (WebGL)

[![Build status](https://ci.appveyor.com/api/projects/status/2ck1bfsp6fyio9hu?svg=true)](https://ci.appveyor.com/project/NaJ64/ballast)

---

### Development Prerequisites:

[Visual Studio Code](https://code.visualstudio.com/)

[.NET Core 2.1 SDK](https://www.microsoft.com/net/download/dotnet-core/sdk-2.1.301)

[Node.js](https://nodejs.org/en/)

---

### Building / Running the web app

After installing all prerequisites, build tasks in Visual Studio Code can be run to setup the project.

- Before the first run ONLY, restore/install all dependencies with following default build task*:

    `Ballast.Web Install/Build (NPM)`     

- For subsequent runs, start the web app in "watch" mode by running the following tasks in Visual Studio Code (sequentially)*:
    - `(1) Ballast.Core Compile/Watch (TypeScript)`
    - `(2) Ballast.Client Compile/Watch (TypeScript)`
    - `(3) Ballast.Client Bundle/Watch (Webpack)`
    - `(4) Ballast.Web Compile/Watch (TypeScript)`
    - `(5) Ballast.Web Bundle/Watch (Webpack)`

      *NOTE:  When running each subsequent task, be sure the previous step has finished (i.e. reached the point of "watching")

- Launch the following configuration to start the .NET application using Visual Studio Code's built-in debugger:

    `Launch 'Ballast.Web' (.NET Core)`
