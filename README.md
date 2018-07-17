# ballast
Browser-based multiplayer game using ASP.NET Core, SignalR, TypeScript, and three.js / WebGL

[![Build status](https://ci.appveyor.com/api/projects/status/2ck1bfsp6fyio9hu?svg=true)](https://ci.appveyor.com/project/NaJ64/ballast)

---

### Development Prerequisites:

[Node.js](https://nodejs.org/en/)

[Git](https://git-scm.com/)

[.NET Core 2.1 SDK](https://www.microsoft.com/net/download/dotnet-core/sdk-2.1.301)

[Visual Studio Code](https://code.visualstudio.com/)

---

After installing all prerequisites, build tasks in Visual Studio Code can be run to setup the project.

- Run task "`Ballast.Web Install/Build (NPM)`" (only needs to be run once initially)

- To start the web app in "watch" mode, run the following tasks in VS Code (sequentially)*:
    - `(1) Ballast.Core Compile/Watch (.NET Core)`
    - `(2) Ballast.Core Compile/Watch (TypeScript)`
    - `(3) Ballast.Client Compile/Watch (TypeScript)`
    - `(4) Ballast.Client Bundle/Watch (Webpack)`
    - `(5) Ballast.Web Compile/Watch (TypeScript)`
    - `(6) Ballast.Web Bundle/Watch (Webpack)`
    - `(7) Ballast.Web Run/Watch (.NET Core)`   <-- This task is not needed if debugging via "`Launch 'Ballast.Web' (.NET Core)`"
    
    *NOTE:  When running each subsequent task, be sure the previous step has finished (reached the point of "watching")