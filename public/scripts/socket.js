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

            // // Get the chatroom messages
            // socket.emit("get messages");
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


        // // Set up the messages event
        // socket.on("messages", (chatroom) => {
        //     chatroom = JSON.parse(chatroom);
        //
        //     // Show the chatroom messages
        //     ChatPanel.update(chatroom);
        // });
        //
        // // Set up the add message event
        // socket.on("add message", (message) => {
        //     message = JSON.parse(message);
        //     // Add the message to the chatroom
        //     ChatPanel.addMessage(message);
        // });
        //
        // socket.on("add typing", (message) => {
        //     ChatPanel.addTyping(message);
        // });

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

    // // This function sends a post message event to the server
    // const postMessage = function(content) {
    //     if (socket && socket.connected) {
    //         socket.emit("post message", content);
    //     }
    // };
    //
    // const postTyping = function(name) {
    //     if (socket && socket.connected) {
    //         socket.emit("post typing", name);
    //     }
    // }

    return { getSocket, connect, disconnect, addPlayer, removePlayer };
})();
