import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    username: string;
    room: string;
}

interface sendMessage {
    message: string;
    time: Date;
    username: string;
}

let allSockets: User[] = [];

wss.on('connection', (socket) => {
    socket.on('message', (message) => {
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message.toString());
            if (!parsedMessage.type || !parsedMessage.payload) {
                throw new Error("Invalid message structure");
            }
        } catch (error) {
            console.error("Error parsing message:", error);
            return;
        }

        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId,
                username: parsedMessage.payload.username,
            });
            console.log("all sockets", allSockets)
        }

        if (parsedMessage.type === "message") {
            let currentUserRoom = null;
            const send_msg: sendMessage = {
                message: parsedMessage.payload.message,
                time: new Date(),
                username: parsedMessage.payload.username,
            };

            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].socket === socket) {
                    currentUserRoom = allSockets[i].room;
                }
            }
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].room === currentUserRoom) {
                    allSockets[i].socket.send(JSON.stringify(send_msg))
                }
            }
        }
    });

    socket.on('close', () => {
        allSockets = allSockets.filter((user) => user.socket !== socket);
    });
});
