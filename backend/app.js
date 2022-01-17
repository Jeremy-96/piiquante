/**
 * Call of the dependencies
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const nocache = require('nocache');

/**
 * Call of the routers
 */
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');

dotenv.config();

/**
 * Connect to database MongoDB with mongoose.connect
 */
mongoose.connect(process.env.DB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Successful connection to MongoDB !'))
  .catch(() => console.log('Failed connection to MongoDB !'));

const app = express();

/**
 * Setting up the CORS (Cross-origin-resource-sharing)
 */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/**
 * Definition of the cache-control and Pragma headers with the nocache package
 * This one disables client-side caching
 */
app.use(nocache());

/**
 * Cookie-session module stores the session data on the client within a cookie
 */
 var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
 app.use(session({
    name: 'session',
    secret: process.env.KEY_SESSION,
    cookie: {
        secure: true, // the browser only sends the cookie on https
        httpOnly: true, // the cookie is sent on http(s) and not on the client javascript
        domain: 'http://localhost:3000',
        path: 'foo/bar',
        expires: expiryDate // sets the expiration date for persistent cookies
    }
}));

/**
 * bodyParser will parse the body of the json file
 */
app.use(bodyParser.json());

/**
 * Le package cors 
 */
app.use(cors());


/**
 * Securing http headers with the Helmet package :
 * x-powered-by
 * Xss
 * Anti-click Jacking (frameguard)
 * X-content-Type (noSniff)
 * CSP 
 * Hsts(Strict-Transport-Security)
 */
app.use(helmet.hidePoweredBy(),
helmet.xssFilter(),
helmet.frameguard({ action: 'deny' }),
helmet.noSniff(),
helmet.contentSecurityPolicy(),
helmet.hsts()
);


app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app
