const mongoose = require('mongoose');
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true}, // MongoDB Id
    name: {type: String, required: true}, // Name of the sauce
    manufacturer: {type: String, required: true}, // Manufacturer of the sauce
    description: {type: String, required: true}, // Description of the sauce
    mainPepper: {type: String, required: true}, // The main spicy ingredient of the sauce
    imageUrl: {type: String, required: true}, // the URL of the image of the sauce downloaded by the user
    heat: {type: Number, required: true}, // Number between 1 and 10 describing the sauce
    likes: {type: Number, defaut: 0}, // Number of users who like the sauce
    dislikes: {type: Number, defaut: 0}, // Number of users who dislike the sauce
    usersLiked: {type: [String]},
    usersDisliked: {type: [String]}
});

module.exports = mongoose.model('Sauce', sauceSchema);
