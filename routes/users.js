var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

var passport = require('passport');

var jwt = require('express-jwt');

var auth = jwt({secret: 'asusme99b', userProperty: 'payload'});


/* GET users listing. */
router.get('/', auth, function(req, res, next) {
	User.find(function(err, user){
		if(err){ return next(err); }

		res.json(user);
	});
});

router.get('/userInfo', function(req, res, next) {

	User.findOne({username: req.body.username}, function(err, user){
		if(err){ return next(err); }

		res.json(user);
	});

});

router.post('/register', function(req, res){	

	//Check if there's another user with the same username
	User.findOne({ username: req.body.username }, function(err, user) {
		if (err) {
			res.status(404).json(err);
		}		
		//If not register the new user
		if (!user){			
			var user = new User();

			user.username = req.body.username;

			user.fullname = req.body.fullname;

			user.setPassword(req.body.password);

			user.save(function (err){
				if(err){ 
					res.status(404).json(err);
					return; 
				}
				res.status(200);
				return res.json({token: user.generateJWT()})
			});
		} else {
			return res.status(400).json({message: 'Ese usuario ya existe. Verifique la disponibilidad'});
		}
		
	});


});

router.post('/login', function(req, res){

	// remove after validation on frontend
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'Por favor llene todos los campos'});
	}


	passport.authenticate('local', function(err, user, info){
		if(err) { 
			res.status(404).json(err);
			return; 
		}

		if(user){
			res.status(200);
			return res.json({token: user.generateJWT()});
		} else {
			
			return res.status(401).json(info);
		}
	})(req, res);
});


router.put('/updateProfile', auth, function(req, res){
    
    User.findOne({ username: req.body.username }, function (err, user){
		if(err){ 
			res.status(404).json(err);
			return; 
		}
		if (!user) { 
			res.status(404).json({message: 'Can\'t find User'});
			return;
		}
		if (req.body.password !== "not") {
			user.setPassword(req.body.password);
		}
		user.fullname = req.body.fullname;
		user.save(function(err, user){ 
			if (err) {
				console.log('There was an error saving to the database: ' + err);
				res.status(404).json(err);
				return;
			}
			return res.status(200).json({token: user.generateJWT()});
		})
		
	});

});


router.post('/check', function(req, res){

	User.findOne({ username: req.body.username }, function(err, user) {
		if (err) {
			console.log('?');
			res.status(404).json(err);
		}
		
		if (!user){			
			res.json({available: true});
		} else {
			res.json({available: false});
		}
		
	});
});

/* DELETE - Deleting one */
router.delete('/:id', auth, function(req, res){
    
    User.remove({ _id: req.params.id }, function(err, user){
        if (err) throw err;

        res.json(user);
    });
});


module.exports = router;
