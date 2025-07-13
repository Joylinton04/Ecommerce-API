import dotenv from "dotenv";
import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import axios from "axios";


dotenv.config()

export const jwtCheck = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: 'uniqueIdentifier',
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

export const verifyUser = async (req, res, next) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  if (!accessToken)
    return res.status(404).json({ success: false, message: "No token found" });
  try {
    const response = await axios.get(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    req.user = response.data;
    next()
  } catch (err) {
    console.log(err);
  }
}

export const verifyAdmin = async (req, res, next) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  if (!accessToken)
    return res.status(404).json({ success: false, message: "No token found" });
  try {
    const response = await axios.get(
      `https://${process.env.AUTH0_DOMAIN}/claims/user`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // req.user = response.data;
    // console.log(response.data)
    next()
  } catch (err) {
    console.log(err);
  }
}



