const express = require("express");

const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

const _ = require('lodash');

// Create the Express app
const app = express();

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use the session middleware to maintain sessions
const gameSession = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 300000 }
});
app.use(gameSession);

// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

// Handle the /register endpoint
app.post("/register", (req, res) => {
    // Get the JSON data from the body
    const { username, avatar, name, password } = req.body;
    //
    // D. Reading the users.json file
    //
    const users = JSON.parse(fs.readFileSync("data/users.json"));
    //
    // E. Checking for the user data correctness
    //
    if(username === '' || avatar === '' || name === '' || password === ''){
        res.json({ status: "error", error: 'Username, avatar, name and password cannot be empty.' });
        return;
    }
    if(!containWordCharsOnly(username)){
        res.json({ status: "error", error: 'Username should contains only underscores, letters or numbers.' });
        return;
    }
    if(username in users){
        res.json({ status: "error", error: 'Username should not exist in the current list of users.' });
        return;
    }
    //
    // G. Adding the new user account
    //
    const hash = bcrypt.hashSync(password, 10);
    users[username] = {name, avatar, password: hash};
    //
    // H. Saving the users.json file
    //
    fs.writeFileSync("data/users.json", JSON.stringify(users, null, " "))
    //
    // I. Sending a success response to the browser
    //
    res.json({ status: "success" });
});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
    // Get the JSON data from the body
    const { username, password } = req.body;

    //
    // D. Reading the users.json file
    //
    const users = JSON.parse(fs.readFileSync("data/users.json"));
    //
    // E. Checking for username/password
    //
    if(username === '' || password === ''){
        res.json({ status: "error", error: 'Username and password cannot be empty.' });
        return;
    }
    if(!(username in users)){
        res.json({ status: "error", error: 'User not registered.' });
        return;
    }
    if(!bcrypt.compareSync(password, users[username].password)){
        res.json({ status: "error", error: 'Wrong password.' });
        return;
    }
    //
    // G. Sending a success response with the user account
    //
    const { avatar, name } = users[username]
    req.session.user = { username, avatar, name };
    io.emit("add user", JSON.stringify({ username, avatar, name }));
    res.json({ status: "success", user: JSON.stringify({ username, avatar, name }) });
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {

    //
    // B. Getting req.session.user
    //
    const user = req.session.user;
    //
    // D. Sending a success response with the user account
    //
    if (user) res.json({ status: "success", user: JSON.stringify(user)});
    else res.json({ status: "error", error: "No user has signed-in in the current session."});
});

// Handle the /signout endpoint
app.get("/signout", (req, res) => {

    //
    // Deleting req.session.user
    //
    io.emit("remove user", JSON.stringify(req.session.user));
    req.session.user = null;
    //
    // Sending a success response
    //
    res.json({ status: "success" });
});


//
// ***** Please insert your Lab 6 code here *****
//
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer);
io.use((socket, next) => {
    gameSession(socket.request, {}, next);
});

let onlineUsers = {};
let player1 = null;
let player2 = null;
io.on("connection", (socket) => {
    // Add a new user to the online user list

    if(socket.request.session.user) {
        const { username, avatar, name } = socket.request.session.user;
        onlineUsers = {...onlineUsers, ...{[username]: {avatar, name}}}
        socket.on("disconnect", () => {
            // Remove the user from the online user list
            delete onlineUsers[username];
        });
        socket.on("add player", (content) => {
            if(content.num === 1 && !_.isEqual(content.user, player2)) {
                player1 = content.user;
                io.emit("players", JSON.stringify({1:player1, 2:player2}));
                io.emit("add player", JSON.stringify(content));
            }
            else if(content.num === 2 && !_.isEqual(content.user, player1)) {
                player2 = content.user;
                io.emit("players", JSON.stringify({1:player1, 2:player2}));
                io.emit("add player", JSON.stringify(content));
            }
        });
        socket.on("remove player", (content) => {
            if(content.num === 1 && _.isEqual(content.user, player1)) {
                player1 = null;
                io.emit("players", JSON.stringify({1:player1, 2:player2}));
                io.emit("remove player", JSON.stringify(content));
            }
            else if(content.num === 2 && _.isEqual(content.user, player2)) {
                player2 = null;
                io.emit("players", JSON.stringify({1:player1, 2:player2}));
                io.emit("remove player", JSON.stringify(content));
            }
        });
        socket.on("get players", () => {
            io.emit("players", JSON.stringify({1:player1, 2:player2}));
        })
        socket.on("move player", (content) => {
            io.emit("move", JSON.stringify(content));
        })
        socket.on("shoot player", (content) => {
            io.emit("shoot", JSON.stringify(content));
        })

    }
});

// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
    console.log("The game server has started...");
});
