const SignInForm = (function() {
    // This function initializes the UI
    const initialize = function() {
        // Populate the avatar selection
        Avatar.populate($("#register-avatar"));
        
        // Hide it
        $("#signin-overlay").hide();

        // Submit event for the signin form
        $("#signin-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the input fields
            const username = $("#signin-username").val().trim();
            const password = $("#signin-password").val().trim();

            // Send a signin request
            Authentication.signin(username, password,
                () => {
                    hide();
                    UserPanel.update(Authentication.getUser());
                    UserPanel.show();
                    PlayerPairUpPanel.show(Authentication.getUser());
                    // GamePanel.gameStart();
                    Socket.connect();
                },
                (error) => { $("#signin-message").text(error); }
            );
        });

        // Submit event for the register form
        $("#register-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the input fields
            const username = $("#register-username").val().trim();
            const avatar   = $("#register-avatar").val();
            const name     = $("#register-name").val().trim();
            const password = $("#register-password").val().trim();
            const confirmPassword = $("#register-confirm").val().trim();

            // Password and confirmation does not match
            if (password != confirmPassword) {
                $("#register-message").text("Passwords do not match.");
                return;
            }

            // Send a register request
            Registration.register(username, avatar, name, password,
                () => {
                    $("#register-form").get(0).reset();
                    $("#register-message").text("You can sign in now.");
                },
                (error) => { $("#register-message").text(error); }
            );
        });
    };

    // This function shows the form
    const show = function() {
        $("#signin-overlay").fadeIn(500);
    };

    // This function hides the form
    const hide = function() {
        $("#signin-form").get(0).reset();
        $("#signin-message").text("");
        $("#register-message").text("");
        $("#signin-overlay").fadeOut(500);
    };

    return { initialize, show, hide };
})();

const UserPanel = (function() {
    // This function initializes the UI
    const initialize = function() {
        // Hide it
        $("#user-panel").hide();

        // Click event for the signout button
        $("#signout-button").on("click", () => {
            // Send a signout request
            Authentication.signout(
                () => {
                    Socket.disconnect();
                    GamePanel.gameOver();
                    hide();
                    SignInForm.show();
                }
            );
        });
    };

    // This function shows the form with the user
    const show = function(user) {
        $("#user-panel").fadeIn(500);
    };

    // This function hides the form
    const hide = function() {
        $("#user-panel").fadeOut(500);
    };

    // This function updates the user panel
    const update = function(user) {
        if (user) {
            $("#user-panel .user-avatar").html(Avatar.getCode(user.avatar));
            $("#user-panel .user-name").text(user.name);
        }
        else {
            $("#user-panel .user-avatar").html("");
            $("#user-panel .user-name").text("");
        }
    };

    return { initialize, show, hide, update };
})();

const PlayerPairUpPanel = (function() {
    let onlinePlayers = {1: null, 2: null};
    // This function initializes the UI
    const initialize = function() {
        $("#pair-up-overlay").hide();
    };

    const update = function(players) {
        onlinePlayers = players;
        for(const num in onlinePlayers) {
            if(onlinePlayers[num]) {
                $(`#player${num}-pair .player${num}-avatar`).html(Avatar.getCode(onlinePlayers[num].avatar));
                $(`#player${num}-pair .player${num}-name`).text(onlinePlayers[num].name);
            }
        }
        if(onlinePlayers[1] !== null && onlinePlayers[2] !== null){
            //Game Start
            let me = Authentication.getUser();
            if(me.name === onlinePlayers[1].name){
                GamePanel.gameStart({num: 1, player: onlinePlayers[1]}, {num: 2, player: onlinePlayers[2]});
            }else{
                GamePanel.gameStart({num: 2, player: onlinePlayers[2]}, {num: 1, player: onlinePlayers[1]});
            }
            $("#pair-up-overlay").hide();
            for(const num in onlinePlayers) {
                if(onlinePlayers[num]) {
                    $(`#player${num}-pair .player${num}-avatar`).html("");
                    $(`#player${num}-pair .player${num}-name`).text("");
                }
            }
        }
    };

    // This function adds a user in the panel
	const addUser = function(user, num) {
        $(`#player${num}-pair .player${num}-avatar`).html(Avatar.getCode(user.avatar));
        $(`#player${num}-pair .player${num}-name`).text(user.name);
	};

    // This function removes a user from the panel
	const removeUser = function(user, num) {
        $(`#player${num}-pair .player${num}-avatar`).html("");
        $(`#player${num}-pair .player${num}-name`).text(`PLAYER ${num}`);
	};

    const show = function(user) {
        $("#pair-up-overlay").show();
        $("#player1-pair").on("click", () => {
            if(onlinePlayers[1] === null){
                Socket.addPlayer({user, num: 1});
            }else{
                Socket.removePlayer({user, num: 1});
            }
        });
        $("#player2-pair").on("click", () => {
            if(onlinePlayers[2]  === null){
                Socket.addPlayer({user, num: 2});
            }else{
                Socket.removePlayer({user, num: 2});
            }
        });
    };

    const hide = function() {
        $("#pair-up-overlay").hide();
    };

    return { initialize, update, addUser, removeUser, show, hide };
})();

//Game Panel
const GamePanel = (() => {

    const cv = $("canvas").get(0);
    const context = cv.getContext("2d");

    let gaming = false;
    let gameArea, player, anotherPlayer;
    let bullets = [];
    let keys = {};
    let prevWalking = false;
    let walking = false;
    let fired = false;

    let zombies = new Map();
    let zombieCount = 0;

    const sounds = {
        background: new Audio("assets/bgm.mp3"),
        footstep: new Audio("assets/footstep.mp3"),
        shellDrop: new Audio("assets/shell_drop.mp3"),
        zombie0: new Audio("assets/zombie_0.mp3"),
        zombie1: new Audio("assets/zombie_1.mp3"),
        zombie2: new Audio("assets/zombie_2.mp3"),
        shoot: new Audio("assets/shoot.mp3"),
        gameover: new Audio("assets/gameover.mp3")
    };

    sounds.footstep.loop = true;
    sounds.footstep.volume = 0.3;
    sounds.shoot.volume = 0.1;
    sounds.background.loop = true;
    sounds.background.volume = 0.3

    let gameStartTime = 0;      // The timestamp when the game starts
    // let collectedGems = 0;      // The number of gems collected in the game

    const initialize = () => {
    }

    const doFrame = (now) => {
        if(!gaming) return;
        if (gameStartTime == 0) gameStartTime = now;
        /* Update the time remaining */
        // const gameTimeSoFar = now - gameStartTime;
        // const timeRemaining = Math.ceil((totalGameTime * 1000 - gameTimeSoFar) / 1000);
        // $("#time-remaining").text(timeRemaining);
        /* Handle the game over situation here */
        // if(timeRemaining == 0){
        //     sounds.background.pause();
        //     sounds.collect.pause();
        //     sounds.gameover.play();
        //     $('#game-over').show();
        //     $('#final-gems').text(collectedGems);
        //     return;
        // }

        /* Update the sprites */
        player.update(now);
        anotherPlayer.update(now);
        bullets.forEach((bullet) => {
            bullet.update();
        })
        zombies.forEach((zombie, key) => {
            zombie.update(now, player, anotherPlayer);
        })

        /* Randomize the gem and collect the gem here */
        // if(gem.getAge(now) >= gemMaxAge){
        //     gem.randomize(gameArea);
        // }
        // if(player.getBoundingBox().isPointInBox(gem.getXY().x, gem.getXY().y)){
        //     sounds.collect.currentTime = 0;
        //     sounds.collect.play();
        //     collectedGems++;
        //     gem.randomize(gameArea);
        // }

        /* Clear the screen */
        context.clearRect(0, 0, cv.width, cv.height);

        /* Draw the sprites */
        player.draw();
        anotherPlayer.draw();
        bullets.forEach((bullet) => {
            bullet.draw();
        })
        zombies.forEach((zombie, key) => {
            zombie.draw();
        })

        /* Process the next frame */
        requestAnimationFrame(doFrame);
    }

    const gameStart = function (me, another) {
        console.log(me.num);
        console.log(another.num);
        const player1XY = { x: 427, y: 240 }
        const player2XY = { x: 727, y: 240 }
        gaming = true;
        /* Create the game area */
        gameArea = BoundingBox(context, 165, 60, 740, 1860);

        /* Create the sprites in the game */
        if(me.num === 1) {
            player = new Player(context, player1XY.x, player1XY.y, gameArea, me.num); // The player
            anotherPlayer = new Player(context, player2XY.x, player2XY.y, gameArea, another.num); // Another player
        }
        else {
            player = new Player(context, player2XY.x, player2XY.y, gameArea, me.num); // The player
            anotherPlayer = new Player(context, player1XY.x, player1XY.y, gameArea, another.num); // Another player
        }
        /* Hide the start screen */
        sounds.background.play();

        // $("#game-start").hide();
        // gem.randomize(gameArea);
        /* Handle the keydown of arrow keys and spacebar */
        $(document).on("keydown", keyDown);

        /* Handle the keyup of arrow keys and spacebar */
        $(document).on("keyup", keyUp);

        spawnZombie();

        /* Start the game */
        requestAnimationFrame(doFrame);
    }

    const gameOver = () => {
        gaming = false;
        $(document).off('keyup');
        $(document).off('keydown');
        context.clearRect(0,0,cv.width,cv.height);
        sounds.footstep.pause();
        sounds.background.pause();
    }

    const spawnZombie = () => {
        setInterval(() => {
            const randomXY = gameArea.randomPoint();
            zombies.set(zombieCount, Zombie(context, randomXY.x, randomXY.y, gameArea))
            zombieCount++;
        }, 1000)
    }

    const keyUp = (event) => {
        // /* Handle the key up */
        walking = prevWalking;
        keys[event.keyCode] = false;
        if(keys[65] && !keys[87] && !keys[68] && !keys[83]){
            walking = true;
            player.move(1);
            Socket.playerMove(1);
        }else if(keys[65] && keys[87] && !keys[68] && !keys[83]){
            walking = true;
            player.move(2);
            Socket.playerMove(2);
        }else if(!keys[65] && keys[87] && !keys[68] && !keys[83]){
            walking = true;
            player.move(3);
            Socket.playerMove(3);
        }else if(!keys[65] && keys[87] && keys[68] && !keys[83]){
            walking = true;
            player.move(4);
            Socket.playerMove(4);
        }else if(!keys[65] && !keys[87] && keys[68] && !keys[83]){
            walking = true;
            player.move(5);
            Socket.playerMove(5);
        }else if(!keys[65] && !keys[87] && keys[68] && keys[83]){
            walking = true;
            player.move(6);
            Socket.playerMove(6);
        }else if(!keys[65] && !keys[87] && !keys[68] && keys[83]){
            walking = true;
            player.move(7);
            Socket.playerMove(7);
        }else if(keys[65] && !keys[87] && !keys[68] && keys[83]){
            walking = true;
            player.move(8);
            Socket.playerMove(8);
        }else{
            walking = false;
            player.stop();
            Socket.playerMove(0);
        }
        if(!keys[32]) {
            fired = false;
        }
        if(walking !== prevWalking){
            prevWalking = false;
            sounds.footstep.pause();
        }
    }

    const keyDown = (event) => {
        /* Handle the key down */
        walking = prevWalking;
        keys[event.keyCode] = true;
        if(keys[65] && !keys[87] && !keys[68] && !keys[83]){
            walking = true;
            player.move(1);
            Socket.playerMove(1);
        }else if(keys[65] && keys[87] && !keys[68] && !keys[83]){
            walking = true;
            player.move(2);
            Socket.playerMove(2);
        }else if(!keys[65] && keys[87] && !keys[68] && !keys[83]){
            walking = true;
            player.move(3);
            Socket.playerMove(3);
        }else if(!keys[65] && keys[87] && keys[68] && !keys[83]){
            walking = true;
            player.move(4);
            Socket.playerMove(4);
        }else if(!keys[65] && !keys[87] && keys[68] && !keys[83]){
            walking = true;
            player.move(5);
            Socket.playerMove(5);
        }else if(!keys[65] && !keys[87] && keys[68] && keys[83]){
            walking = true;
            player.move(6);
            Socket.playerMove(6);
        }else if(!keys[65] && !keys[87] && !keys[68] && keys[83]){
            walking = true;
            player.move(7);
            Socket.playerMove(7);
        }else if(keys[65] && !keys[87] && !keys[68] && keys[83]){
            walking = true;
            player.move(8);
            Socket.playerMove(8);
        }
        if(keys[32]){
            if(!fired) {
                bullets.push(Projectile(context, player, gameArea));
                sounds.shoot.currentTime = 0;
                sounds.shoot.play();
                setTimeout(() => {
                    sounds.shellDrop.currentTime = 0;
                    sounds.shellDrop.play();
                }, 200)
                Socket.playerShoot();
                fired = true;
            }
        }
        if(prevWalking !== walking){
            sounds.footstep.play();
            prevWalking = true;
        }
    }

    const anotherPlayerMove = (code) => {
        if(code === 0){
            //Another player stop
            anotherPlayer.stop();
            if(walking !== prevWalking){
                prevWalking = false;
                sounds.footstep.pause();
            }
        }else{
            //Another player move
            anotherPlayer.move(code);
            if(prevWalking !== walking){
                sounds.footstep.play();
                prevWalking = true;
            }
        }
    }

    const anotherPlayerShoot = () => {
        bullets.push(Projectile(context, anotherPlayer, gameArea));
        sounds.shoot.currentTime = 0;
        sounds.shoot.play();
        setTimeout(() => {
            sounds.shellDrop.currentTime = 0;
            sounds.shellDrop.play();
        }, 200)
    }

    return { gameStart, initialize, gameOver, anotherPlayerMove, anotherPlayerShoot };
})();

//
// const ChatPanel = (function() {
// 	// This stores the chat area
//     let chatArea = null;
//     let timer = null;
//     // This function initializes the UI
//     const initialize = function() {
// 		// Set up the chat area
// 		chatArea = $("#chat-area");
//
//         // Submit event for the input form
//         $("#chat-input-form").on("submit", (e) => {
//             // Do not submit the form
//             e.preventDefault();
//
//             // Get the message content
//             const content = $("#chat-input").val().trim();
//
//             // Post it
//             Socket.postMessage(content);
//
// 			// Clear the message
//             $("#chat-input").val("");
//         });
//
//         $("#chat-input-form").on("keydown", (e) => {
//             Socket.postTyping($("#user-panel .user-name").html());
//         })
//  	};
//
//     // This function updates the chatroom area
//     const update = function(chatroom) {
//         // Clear the online users area
//         chatArea.empty();
//
//         // Add the chat message one-by-one
//         for (const message of chatroom) {
// 			addMessage(message);
//         }
//     };
//
//     // This function adds a new message at the end of the chatroom
//     const addMessage = function(message) {
// 		const datetime = new Date(message.datetime);
// 		const datetimeString = datetime.toLocaleDateString() + " " +
// 							   datetime.toLocaleTimeString();
//
// 		chatArea.append(
// 			$("<div class='chat-message-panel row'></div>")
// 				.append(UI.getUserDisplay(message.user))
// 				.append($("<div class='chat-message col'></div>")
// 					.append($("<div class='chat-date'>" + datetimeString + "</div>"))
// 					.append($("<div class='chat-content'>" + message.content + "</div>"))
// 				)
// 		);
// 		chatArea.scrollTop(chatArea[0].scrollHeight);
//     };
//
//     const addTyping = function (name) {
//         if(name === $("#user-panel .user-name").html()) return;
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//             $("#chat-typing").html("");
//         }, 3000)
//         $("#chat-typing").html(`${name} is typing...`);
//     }
//
//     return { initialize, update, addMessage, addTyping };
// })();

const UI = (function() {
    // This function gets the user display
    const getUserDisplay = function(user) {
        return $("<div class='field-content row shadow'></div>")
            .append($("<span class='user-avatar'>" +
			        Avatar.getCode(user.avatar) + "</span>"))
            .append($("<span class='user-name'>" + user.name + "</span>"));
    };

    // The components of the UI are put here
    const components = [SignInForm, UserPanel, PlayerPairUpPanel];

    // This function initializes the UI
    const initialize = function() {
        // Initialize the components
        for (const component of components) {
            component.initialize();
        }
    };

    return { getUserDisplay, initialize };
})();
