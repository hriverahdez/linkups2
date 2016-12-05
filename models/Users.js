var mongoose = require('mongoose');
var crypto = require('crypto');
var secret = process.env.secret;
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true},
    fullname: {type: String, default: "DEFAULT USER"},  
    hash: String,
    salt: String,
    role: {type: String, default: "GUEST"}
});


/* Setting the password using pbkdf2Sync | takes 4 parametes: passwors, salt, iterations and key length */
UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

/* Check password */
UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

    return this.hash === hash;
};

UserSchema.methods.setRole = function(role) {
    this.role = role;
};


UserSchema.methods.generateJWT = function() {

    // set expiration to 60 days
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 10);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        fullname: this.fullname,
        role: this.role,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

mongoose.model('User', UserSchema);