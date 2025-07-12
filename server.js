import express from 'express'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js';
import dotenv from "dotenv";
import cors from 'cors'
import productRoute from './route/product.route.js';
import { jwtCheck } from './middleware/auth.middleware.js';

dotenv.config();

const app = express()

connectDB()
connectCloudinary()


app.use(cors({origin: 'http://localhost:5173', credentials: true}))
app.use('/api/product', productRoute)

app.get('/', (req,res) => {
  res.send("API working...")
})
app.get('/protected', jwtCheck,(req,res) => {
  res.send("Authorized...")
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