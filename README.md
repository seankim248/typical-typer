# typical-typer

A web application for typists who want to practice their typing skills and compete against other users.

The minimalist aesthetic was inspired by monkeytype.com but their website does not include a multiplayer feature. So I combined the aesthetics of monkeytype and functionality of type racing with other users.

## Live Demo

Try the application live at https://typical-typer.herokuapp.com/

## Technologies Used

 - [Socket.io](https://socket.io/)
 - React
 - PostgreSQL
 - Node.js
 - Express.js
 - Babel
 - Webpack
 - Dotenv
 - Node-Fetch
 - HTML5
 - CSS3
 - JavaScript
 - Heroku

## Features

 - User can type by themselves
 - User can select duration of their typing session
 - User can view their wpm
 - User can create a lobby
 - User can join a lobby
 - User can create a temporary username
 - User can type with other users
 - User can view their live progress when typing
 - User can reset the typing session / game

## Stretch features I'd like to implement

 - User can change prompt to words or quotes (single player only)
 - User can see what place they finish (multiplayer only)

## Preview

![Kapture 2022-03-10 at 11 33 09](https://user-images.githubusercontent.com/59588689/157740953-f2891e3b-79e4-47b7-b41b-b98c5ca0584d.gif)

![Kapture 2022-03-10 at 11 01 12](https://user-images.githubusercontent.com/59588689/157738690-879b37a4-bc96-40db-99f6-2c6f84a0251f.gif)

## Development

### System Requirements

 - Node.js 16 or higher
 - NPM 8 or higher
 - Postgres

### Getting Started

1. Clone the repository.

    ```shell
    git clone git@github.com:seankim248/typical-typer.git
    cd typical-typer
    ```

1. Install all dependencies with NPM.

    ```shell
    npm install
    ```

1. Create a copy of the .env.example file.

    ```shell
    cp .env.example .env
    ```
    
1. Start PostgreSQL.

    ```shell
    sudo service postgresql start
    ```

1. Create a database

    ```shell
    createdb typicalTyper
    ```

1. Import the quote database to PostgreSQL

    ```shell
    npm run db:import
    ```
    
1. View your database through Pgweb (if installed)

    ```shell
    pgweb --db=typicalTyper
    ```
    
1. Start the project. Once started, you can view the application by opening http://localhost:3000 in your browser.

    ```shell
    npm run dev
    ```
    
    
