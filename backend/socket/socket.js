const { Server } = require('socket.io')
const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const cors = require('cors')
const { client } = require('../db/redis')



const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"],
        credentials: true 
    },
    transports: ['websocket', 'polling']
});

io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        socket.on('join_showtime', (showtimeId) => {
            socket.join(showtimeId);
            console.log(`User ${socket.id} joined room ${showtimeId}`);
        });
        socket.on('hold_seat', async ({ showtimeId, seatName, userId }) => {
            const key = `seat:${showtimeId}:${seatName}`;
            const holder = await client.get(key);
            if (holder && holder !== userId) {
                socket.emit('error_message', 'Ghế này đã có người chọn!');
                return;
            }
            try {
                const result = await client.set(key, userId, { EX: 300, NX: true });
                if (result === 'OK') {
                    io.to(showtimeId).emit('seat_locked', { seatName, userId });
                    console.log(`Seat ${seatName} locked by ${userId}`);
                } else {
                    socket.emit('error_message', 'Chậm tay rồi! Ghế vừa bị người khác lấy.');
                }
            } catch (err) {
                console.error(err);
            }
        });
        socket.on('release_seat', async ({ showtimeId, seatName, userId }) => {
            const key = `seat:${showtimeId}:${seatName}`;
            const holder = await client.get(key);
            if (holder === userId) {
                await client.del(key);
                io.to(showtimeId).emit('seat_released', { seatName });
            }
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
})

module.exports = { server , io , app }