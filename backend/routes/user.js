/**
 * On crée la route utilisateur
 */
 const express = require('express');
 const router = express.Router();
 
 const userCtrl = require('../controllers/user');
 const passwordValidator = require('../middleware/passwordVal');
 
 router.post('/signup', passwordValidator, userCtrl.signup);
 router.post('/login', userCtrl.login);
 
 module.exports = router;