import express from 'express'
import connectDB from './config/mongodb.js'
import { auth } from 'express-openid-connect';

const app = express()

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'S2AeuMdKcVulnq3SpaS67BLzKnGlcdwN',
  issuerBaseURL: 'https://dev-3dmvhxpk5h27gflm.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});




// connectDB()



const port = 3000
app.listen(port, () => {
    console.log("Server is Up!!")
})