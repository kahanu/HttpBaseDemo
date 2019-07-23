# HttpBase Demo

[Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

This project demonstrates how to integrate an HttpBase class into your Angular 8 project to encapsulate the CRUD operations for services.

## Project Structure
There are three (3) parts to this project:

1)  Angular app - this is the basic Angular project that contains a Customer component that executes the basic CRUD operations against a MongoDB database.
2)  NodeJS server - this RESTful WebApi server (written in Typescript) connects to MongoDB and contains the CRUD Http Verb operations, GET, POST, PUT, DELETE.
3)  MongoDB database - this is a local database for development purposes.

## Requirements to run this project
To run this demo, you must have the following tools installed on your system:

1)  Angular CLI - version 8
2)  NodeJS and npm - see Angular documentation for the recommended versions.
3)  Typescript
4)  MongoDB - install this locally to development
5)  IDE of choice - [Visual Studio Code](https://code.visualstudio.com) (recommended) 

## How to Use
To run this demo enter two commands in the folder path:

To start the NodeJs server, open another command-prompt or shell and enter:

```javascript
npm run server
```

To start the Angular project, open a command-prompt or shell and enter:

```javascript
npm start
```

Then open your browser to ```http://localhost:4200```.  The Customer link will contain the page with the CRUD operations.  Add a new customer to see how it works.

## HttpBase class
To view the HttpBase class and how it is used, look at the source in:

```javascript
src/app/core/http-base.ts
```
