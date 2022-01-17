const Sauce = require('../models/Sauce')
const fs = require('fs');

/**
 * Controller for object creation
 */
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Registered item !'}))
    .catch(error => res.status(400).json({ error }));
};

/**
 * Controller to get object
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
 * Controller for object modification
 */
 exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Modified item !'}))
    .catch(error => res.status(403).json({ message: '403:unauthorized request' }));
};

/**
 * Controller for object 
 */
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Deleted item !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

/**
 * Controller for object deletion
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
 * Like and dislike controller
 */
exports.likeSauce = (req, res, next) => {
  // Recovering the object id
  Sauce.findOne({_id : req.params.id})
  .then((sauce) => {
    // If like = 1, update the table 
    if(!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
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

    if(sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
      Sauce.updateOne(
        {_id : req.params.id},
        {
          $inc: {likes: -1},
          $pull: {usersLiked: req.body.userId}
        }
      )
      .then(() => res.status(201).json({ message: 'This user has no more reviews of your sauce'}))
      .catch((error) => res.status(400).json({error}));
    }

    if(!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
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

    if(sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
      Sauce.updateOne(
        {_id : req.params.id},
        {
          $inc: {dislikes: -1},
          $pull: {usersDisliked: req.body.userId}
        }
      )
      .then(() => res.status(201).json({ message: 'This user has no more reviews of your sauce'}))
      .catch((error) => res.status(400).json({error}));
    }
  })
  .catch((error) => res.status(404).json({error}));
}