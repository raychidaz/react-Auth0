const express = require("express");
require("dotenv").config();
const jwt = require("express-jwt"); // validare JWT and set req.user
const jwksRsa = require("jwks-rsa"); // Retrieve RSA keys from a JSON Web Key set(JWKS) endpoint

const checkJwt = jwt({
  // Dynamically provide a signing key based on the key in the header
  // and the signing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true, //cache the signing key
    rateLimit: true,
    jwksRequestsPerMinute: 5, // prevent attackers from requesting more than 5 per minute
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

  // This must match the algorith selected in the Auth0 dashboard under your app's advanced settings under the 0Auth tab
  algorithms: ["RS256"],
});

const app = express();

app.get("/public", (req, res) => {
  res.json({
    message: "Hello from a public API",
  });
});

app.get("/private", checkJwt, (req, res) => {
  res.json({
    message: "Hello from a private API",
  });
});

app.listen(3001);
console.log("API server listening on " + process.env.REACT_APP_API_URL);
