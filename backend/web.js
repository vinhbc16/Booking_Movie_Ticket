require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const movieRoute = require('./routes/movieRoute')
const theaterRoute = require('./routes/theaterRoute')
const roomRoute = require('./routes/roomRoute')
const showtimeRoute = require('./routes/showtimeRoute')
const authRoute = require('./routes/authRoute')
const { NotFoundError } = require('./errors/custom-error')
const notFound = require('./middlewares/not-found')
const errorHandlerMiddleware = require('./middlewares/error-handler')
const PORT = process.env.PORT || 3000

app.use(rateLimit({
    windowMs: 15*60*1000,
    max: 100,
    message: 'Too many request from this IP , please try again later'
}))
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use('/api/v1/movies', movieRoute)
app.use('/api/v1/theaters', theaterRoute)
app.use('/api/v1/showtimes', showtimeRoute)
app.use('/api/v1/rooms', roomRoute)
app.use('/api/v1/auth', authRoute)
app.use(notFound);
app.use(errorHandlerMiddleware);



const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas...')
        app.listen(PORT,() => {
            console.log(`Server is listening on port ${PORT}`)
        })
    } catch(error) {
        console.log(error)
    }
}
start()