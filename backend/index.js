import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './db/connectDB.js'
import authRouter from './routes/auth.route.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
        credentials: true,
    })
)

// app.get('/', (req, res) => {
//     res.send('hello world')
// })

app.use('/api/auth', authRouter)

app.listen(PORT, () => {
    connectDB()
    console.log(`"server is running on PORT" = ${PORT}`)
})