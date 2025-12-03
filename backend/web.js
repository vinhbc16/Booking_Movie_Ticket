require('dotenv').config()
const connectDB = require('./db/connect')
const express = require('express')
const { server , io , app } = require('./socket/socket')
const cors = require('cors')
const { connectRedis } = require('./db/redis')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const movieRoute = require('./routes/admin/movieRoute')
const theaterRoute = require('./routes/admin/theaterRoute')
const roomRoute = require('./routes/admin/roomRoute')
const showtimeRoute = require('./routes/admin/showtimeRoute')
const customerMovieRoute = require('./routes/customer/customerMovieRoute')
const customerTheaterRoute = require('./routes/customer/customerTheaterRoute')
const customerRoomRoute = require('./routes/customer/customerRoomRoute')
const customerShowtimeRoute = require('./routes/customer/customerShowtimeRoute')
const getFeaturedMoviesRoute = require('./routes/customer/getFeaturedMoviesRoute')
const notFound = require('./middlewares/not-found')
const errorHandlerMiddleware = require('./middlewares/error-handler')
const cookieParser = require('cookie-parser')
const authAdminRoute = require('./routes/admin/authAdminRoute')
const authCustomerRoute = require('./routes/customer/authCustomerRoute')


const PORT = process.env.PORT || 3000

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
}));
app.use(rateLimit({
    windowMs: 15*60*1000,
    max: 1000,
    message: 'Too many request from this IP , please try again later'
}))
app.use(helmet())
app.use(express.json())
app.use(cookieParser())


app.use('/api/v1/admin/auth', authAdminRoute)
app.use('/api/v1/admin/movies', movieRoute)
app.use('/api/v1/admin/theaters', theaterRoute)
app.use('/api/v1/admin/showtimes', showtimeRoute)

app.use('/api/v1/auth', authCustomerRoute)
app.use('/api/v1/movies', customerMovieRoute)
app.use('/api/v1/theaters', customerTheaterRoute)
app.use('/api/v1/rooms', customerRoomRoute)
app.use('/api/v1/showtimes', customerShowtimeRoute)
app.use('/api/v1/featured-movies', getFeaturedMoviesRoute)

app.use(notFound);
app.use(errorHandlerMiddleware);



const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI);
        await connectRedis();
        server.listen(PORT,() => {
            console.log(`Server is listening on port ${PORT}`)
        })
    } catch(error) {
        console.log(error)
    }
}
start()