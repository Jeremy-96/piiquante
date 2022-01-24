const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const saucesCtrl = require('../controllers/sauces');

/**
 * Create router items
 * Each root requires access authentication
 */
router.get('/', auth, saucesCtrl.getAllSauce); // Display all objects
router.post('/', auth, multer, saucesCtrl.createSauce); // Create object
router.get('/:id', auth, saucesCtrl.getOneSauce); // Display one object
router.put('/:id', auth, multer, saucesCtrl.modifySauce); // Modify object
router.post('/:id/like', auth, saucesCtrl.likeSauce); // Like or dislike 
router.delete('/:id', auth, saucesCtrl.deleteSauce); // Delete object

module.exports = router;