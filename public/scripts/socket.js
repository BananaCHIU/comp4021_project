const Socket = (function() {
    // This stores the current Socket.IO socket
    let socket = null;

    // This function gets the socket from the module
    const getSocket = function() {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function() {
        socket = io();

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            // Get the online user list
            socket.emit("get players");
        });

        // Set up the users event
        socket.on("players", (onlinePlayers) => {
            onlinePlayers = JSON.parse(onlinePlayers);

            // Show the online users
            PlayerPairUpPanel.update(onlinePlayers);
        });

        // Set up the remove user event
        socket.on("remove player", (content) => {
            content = JSON.parse(content)
            // Remove the online user
            PlayerPairUpPanel.removeUser(content.user, content.num);
        });

        socket.on("add player", (content) => {
            content = JSON.parse(content);

            PlayerPairUpPanel.addUser(content.user, content.num);
        });

        socket.on("move", (content) => {
            content = JSON.parse(content);
            if(content.user.name !== Authentication.getUser().name){
                GamePanel.anotherPlayerMove(content.code);
            }
        });

        socket.on("shoot", (content) => {
            content = JSON.parse(content);
            if(content.user.name !== Authentication.getUser().name){
                GamePanel.anotherPlayerShoot();
            }
        });
    };

    // This function disconnects the socket from the server
    const disconnect = function() {
        socket.disconnect();
        socket = null;
    };

    const addPlayer = (content) => {
        if (socket && socket.connected) {
            socket.emit("add player", content);
        }
    }

    const removePlayer = (content) => {
        if (socket && socket.connected) {
            socket.emit("remove player", content);
        }
    }

    const playerMove = (code) => {
        if (socket && socket.connected) {
            socket.emit("move player", {code, user: Authentication.getUser()});
        }
    }

    const playerShoot = () => {
        if (socket && socket.connected) {
            socket.emit("shoot player", {user: Authentication.getUser()});
        }
    }
    return { getSocket, connect, disconnect, addPlayer, removePlayer, playerShoot, playerMove };
})();
