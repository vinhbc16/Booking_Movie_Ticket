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

const socketSeatMap = new Map();

io.on('connection', (socket) => {
    
    socket.isPaymentProcessing = false;

    socket.on('join_showtime', async ({ showtimeId, userId }) => {
        socket.join(showtimeId);
        
        try {
            const keys = await client.keys(`seat:${showtimeId}:*`);
            
            const heldSeats = []; 
            const mySeats = [];   

            for (const key of keys) {
                const holderId = await client.get(key);
                const seatName = key.split(':').pop();

                if (userId && holderId === userId) {
                    mySeats.push(seatName);
                } else {
                    heldSeats.push(seatName);
                }
            }

            socket.emit('sync_seat_status', { heldSeats, mySeats });

        } catch (err) {
            console.error("Socket Error (Sync):", err);
        }
    });

    socket.on('hold_seat', async ({ showtimeId, seatName, userId }) => {
        const key = `seat:${showtimeId}:${seatName}`;
        try {
            const holder = await client.get(key);
            if (holder && holder !== userId) {
                socket.emit('error_message', 'This seat has already been selected by someone else!');
                return;
            }
            
            const result = await client.set(key, userId, { EX: 300, NX: true });
            
            if (result === 'OK') {
                io.to(showtimeId).emit('seat_locked', { seatName, userId });
                
                if (!socketSeatMap.has(socket.id)) socketSeatMap.set(socket.id, []);
                socketSeatMap.get(socket.id).push({ key, showtimeId, seatName });
            } else {
                socket.emit('error_message', 'This seat was just selected by someone else!');
            }
        } catch (err) {
            console.error("Socket Error (Hold):", err);
        }
    });

    socket.on('release_seat', async ({ showtimeId, seatName, userId }) => {
        const key = `seat:${showtimeId}:${seatName}`;
        try {
            const holder = await client.get(key);
            if (holder === userId) {
                await client.del(key);
                io.to(showtimeId).emit('seat_released', { seatName });
                
                if (socketSeatMap.has(socket.id)) {
                    const seats = socketSeatMap.get(socket.id).filter(s => s.seatName !== seatName);
                    socketSeatMap.set(socket.id, seats);
                }
            }
        } catch (err) {
            console.error("Socket Error (Release):", err);
        }
    });

    socket.on('start_payment', async ({ showtimeId, seats }) => {
        console.log(`User ${socket.id} started payment. Extending seat hold...`);
        
        socket.isPaymentProcessing = true;


        for (const seatName of seats) {
            const key = `seat:${showtimeId}:${seatName}`;
            try {
                await client.expire(key, 900); 
            } catch (err) {
                console.error(`Error extending seat ${seatName}:`, err);
            }
        }
    });

    socket.on('disconnect', async () => {
        if (socket.isPaymentProcessing) {
            console.log(`User ${socket.id} navigated to payment page (or temporary network loss). KEEPING SEATS.`);
            return; 
        }

        console.log(`User ${socket.id} disconnected. Cleaning up seats...`);
        
        if (socketSeatMap.has(socket.id)) {
            const seatsToRelease = socketSeatMap.get(socket.id);
            for (const seatInfo of seatsToRelease) {
                try {
                    await client.del(seatInfo.key);
                    io.to(seatInfo.showtimeId).emit('seat_released', { seatName: seatInfo.seatName });
                } catch (err) {
                    console.error("Auto Release Error:", err);
                }
            }
            socketSeatMap.delete(socket.id);
        }
    });
})

module.exports = { server , io , app }