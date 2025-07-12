import express from 'express'
import connectDB from './config/mongodb.js'
import dotenv from "dotenv";
import cors from 'cors'
import { jwtCheck } from './middleware/auth.middleware.js';

dotenv.config();


const app = express()

app.use(cors({origin: 'http://localhost:5173', credentials: true}))


app.get('/protected', jwtCheck,(req, res) => {
  res.send('This is a protected route')
})

app.use((req, res, next)=> {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal server error"
  res.status(status).send(message)
})


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Server is Up!!")
})