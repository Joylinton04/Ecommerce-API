import dotenv from "dotenv";
import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

dotenv.config()

export const jwtCheck = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-3dmvhxpk5h27gflm.us.auth0.com/.well-known/jwks.json`,
  }),
  audience: 'uniqueIdentifier',
  issuer: 'https://dev-3dmvhxpk5h27gflm.us.auth0.com/',
  algorithms: ['RS256']
});

