# Diceroom

Diceroom is an interactive chat room, where users can input dice formulas to roll dice
and share the results in real time. It is mainly intended as a minimal supporting tool for
remote D&D games.

## Project goals

 - Make a dice roll system and successfully use it in a remote D&D game
 - Learn modern web technology including Node.js and frontend frameworks

## Use

  Install dependencies:

  ```npm install```

  Build:

  ```npm run build```

  Run:

  ```npm start```

## Technologies

### Using

 - [Node.js](nodejs.org) provides Javascript runtime for the backend
 - [Express](expressjs.com) is a minimalist web framework for Node.js
 - [socket.io](socket.io) handles HTML sockets
 - [Babel](babeljs.io) compiles Javascript for modern JS features
 - [nodemon](github.com/remy/nodemon) monitors changes and restarts Node.js when developing
 - [dotenv](gitlab.com/motdotla/dotenv) loads environment variables from a file

### Other stuff I might want to look at

 - [CORS](github.com/expressjs/cors) manages browser-server interaction
 - [Sequelize](sequelize.org) manages object-relational mapping for database interaction
 - [pg](github.com/brianc/node-postgres) interfaces with a PostgreSQL server
 - [pg-hstore](github.com/scarney81/pg-hstore) serializes JSON data

## Tutorials

 - https://medium.com/dataseries/how-to-build-a-chat-app-with-react-socket-io-and-express-190d927b7002
 - https://socket.io/get-started/chat/
