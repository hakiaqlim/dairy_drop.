let io;

module.exports = {
    init: (httpServer) => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: '*', // For development, allow all origins. You should restrict this in production.
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
            },
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    },
};
