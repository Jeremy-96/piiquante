/**
 * The password-validator module adds an additional password check
 */
const passwordSchema = require('../models/Password');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.writeHead(400, {message:"Password required: 8 characters minimum. At least 1 upper case, 1 lower case. No spaces."}, {
            'content-type': 'application/json'
        });
        res.end('Incorrect password format');
    } else {
        next();
    }
};