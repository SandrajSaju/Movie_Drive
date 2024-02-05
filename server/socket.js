let activeUsers = [];

function configureSocket(io) {
    io.on("connection", (socket) => {
        socket.on("new-user-add", (newUserId) => {
            if (!activeUsers.some((user) => user.userId === newUserId)) {
                activeUsers.push({
                    userId: newUserId,
                    socketId: socket.id,
                });
            }

            console.log("Connected Users", activeUsers);
            io.emit("get-users", activeUsers);
        });

        socket.on("send-message", (data) => {
            const { receiverId } = data;
            const user = activeUsers.find((user) => user.userId === receiverId);

            if (user) {
                const mess = io.to(user.socketId).emit("receive-message", data);
                if (mess) {
                    console.log("Receiving on socket : ", user.socketId, data);
                }
            }
        });

        socket.on("disconnect", () => {
            activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);

            console.log("User Disconnected", activeUsers);
            io.emit("get-users", activeUsers);
        });
    });
}

module.exports = { configureSocket };