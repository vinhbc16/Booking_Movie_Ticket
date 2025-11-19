require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const movieRoute = require('./routes/admin/movieRoute')
const theaterRoute = require('./routes/admin/theaterRoute')
const roomRoute = require('./routes/admin/roomRoute')
const showtimeRoute = require('./routes/admin/showtimeRoute')
const authRoute = require('./routes/authRoute')
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
app.use('/api/v1/auth', authRoute)



app.use('/api/v1/admin/movies', movieRoute)
app.use('/api/v1/admin/theaters', theaterRoute)
app.use('/api/v1/admin/showtimes', showtimeRoute)
app.use('/api/v1/admin/rooms', roomRoute)



app.use(notFound);
app.use(errorHandlerMiddleware);



const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI);
        // console.log('Connected to MongoDB Atlas...')
        app.listen(PORT,() => {
            console.log(`Server is listening on port ${PORT}`)
        })
    } catch(error) {
        console.log(error)
    }
}
start()