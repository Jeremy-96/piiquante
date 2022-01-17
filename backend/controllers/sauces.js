const Sauce = require('../models/Sauce')
const fs = require('fs');

/**
 * On crée le controleur qui va permettre la création d'un objet
 */
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

/**
 * Controleur qui va récupérer un objet
 */
exports.getOneSauce = ('/:id', (req, res, next) => {
    Sauce.findOne({
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
});

/**
 * COntroleur permettant la modification d'un objet
 */
 exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

/**
 * Controleur de suppression d'objet
 */
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

/**
 * Controleur aui va récupérer tous les objets
 */
exports.getAllSauce = ('/' +
  '', (req, res, next) => {

  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

/**
 * Controleur pour le like et dislike
 * On gère un like = +1
 * Ensuite un like neutre donc = 0
 * Et enfin un like = -1 (dislike)
 */
exports.likeSauce = (req, res, next) => {

  // On va rechercher l'id de l'objet
  Sauce.findOne({_id : req.params.id})
  .then((sauce) => {

    // Quand la valeur de like est 1
    if(!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
      // On modifie la valeur de like
      Sauce.updateOne(
        {_id : req.params.id},
        {
          $inc: {likes: 1},
          $push: {usersLiked: req.body.userId}
        }
      )
      .then(() => res.status(201).json({ message: 'This user like your sauce'}))
      .catch((error) => res.status(400).json({error}));
    }

    // Quand la valeur de like est 0
    if(sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
      // On modifie la valeur de like
      Sauce.updateOne(
        {_id : req.params.id},
        {
          $inc: {likes: -1},
          $pull: {usersLiked: req.body.userId}
        }
      )
      .then(() => res.status(201).json({ message: 'This user have no idea about your sauce'}))
      .catch((error) => res.status(400).json({error}));
    }

    // Quand la valeur du dislike est 1
    if(!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
      // On modifie la valeur du dislike
      Sauce.updateOne(
        {_id : req.params.id},
        {
          $inc: {dislikes: 1},
          $push: {usersDisliked: req.body.userId}
        }
      )
      .then(() => res.status(201).json({ message: 'This user dislike your sauce'}))
      .catch((error) => res.status(400).json({error}));
    }

    // Quand la valeur du dislike est 0
    if(sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
      // On modifie la valeur du dislike
      Sauce.updateOne(
        {_id : req.params.id},
        {
          $inc: {dislikes: -1},
          $pull: {usersDisliked: req.body.userId}
        }
      )
      .then(() => res.status(201).json({ message: 'This user disabled  dislike your sauce'}))
      .catch((error) => res.status(400).json({error}));
    }
  })

  .catch((error) => res.status(404).json({error}));
}