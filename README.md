# ballast
Browser-based multiplayer game using ASP.NET Core, SignalR, TypeScript, and three.js (WebGL)

[![Build status](https://ci.appveyor.com/api/projects/status/2ck1bfsp6fyio9hu?svg=true)](https://ci.appveyor.com/project/NaJ64/ballast)

---

### Development Prerequisites:

[Visual Studio Code](https://code.visualstudio.com/)

[.NET Core 2.2 SDK](https://dotnet.microsoft.com/download/dotnet-core/2.2)

[Node.js](https://nodejs.org/en/)

---

### Building Node.js / NPM projects:
Node.js packages `gulp` and `lerna` are required for building npm projects.

1. Run the following (one time) to install packages globally:

        npm install -g lerna gulp

2. Run the following to have lerna to install all dependencies & build all projects:

        lerna bootstrap

### Building .NET Core projects / solution:
Run the following to restore/build the solution using the .NET CLI:

    dotnet build

---

### Debugging / running the web app in *Visual Studio Code*

- Launch the following configuration to start the .NET application using Visual Studio Code's built-in debugger:

        Debug 'ballast-web' (.NET Core)

- Alternatively, launch the following configuration to start the electron client app (without local server) and connect to the production game server

        Debug 'ballast-electron' (Node.js)


