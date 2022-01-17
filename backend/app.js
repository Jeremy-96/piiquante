const express = require('express');
//const cors = require('cors');
const helmet = require('helmet');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const nocache = require('nocache');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');

dotenv.config();

/**
 * Connexion à la base de données MongoDB via mongoose
 */
mongoose.connect(process.env.DB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();


/**
 * Mise en place du CORS (Cross-origin-resource-sharing)
 */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/**
 * Définition des entêtes cache-control et Pragma grace au package nocache
 * Celui-ci désactive la mise en cache côté client
 */
 app.use(nocache());

/**
 * On utilise le package de cookie-session pour sécuriser les cookies de la session en cours
 */
 var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
 app.use(session({
    name: 'session',
    secret: process.env.KEY_SESSION,
    cookie: {
        secure: true, // le navigateur n'envoie le cookie que sur https
        httpOnly: true, // le cookie est envoyé sur http(s) et pas sur le javascript client
        domain: 'http://localhost:3000',
        path: 'foo/bar',
        expires: expiryDate // définit la date d'expiration des cookies persistants
    }
}));


app.use(bodyParser.json());

/**
 * Le package cors 
 
app.use(cors());
var corsOptions = {
  origin: 'http://localhost:8081',
  optionsSuccessStatus: 200 
}
app.get('/', cors(corsOptions), function (req, res, next) {
  res.json({message: 'This is CORS-enabled for all origins!'})
})
app.listen(8081, function () {
  console.log('CORS-enabled web server listening on port 8081')
})
*/

/**
 * Sécurisation des entêtes http grace au package d'Helmet
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


/**
 * Routes qui vont déservir l'application
 */
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app
