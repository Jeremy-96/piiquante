const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const saucesCtrl = require('../controllers/sauces');

/**
 * Create router items
 * Each root requires access authentication
 */
router.get('/', auth, saucesCtrl.getAllSauce); // Affichage de tous les objets
router.post('/', auth, multer, saucesCtrl.createSauce); // Création d'un objet
router.get('/:id', auth, saucesCtrl.getOneSauce); // Affichage d'un seul objet
router.put('/:id', auth, multer, saucesCtrl.modifySauce); // Modification dun objet
router.post('/:id/like', auth, saucesCtrl.likeSauce); // Like ou dislike d'un objet
router.delete('/:id', auth, saucesCtrl.deleteSauce); // Suppression d'un objet

module.exports = router;