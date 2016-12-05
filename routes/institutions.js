var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Institution = mongoose.model('Institution');
var secret = process.env.secret;
var jwt = require('express-jwt');

var auth = jwt({secret: secret, userProperty: 'payload'});

/* GET - Reading all */
router.get('/', auth, function(req, res, next) {

	Institution.find(function(err, inst){
		if(err){ return next(err); }

		res.json(inst);
	});
});

/* POST - Creating one */
router.post('/', auth, function(req, res, next) {	
		
	var institution = new Institution(req.body);
	var today = new Date();    
	institution.createdBy = req.payload.username;
	institution.createdAt = today.getTime();
	institution.last_modification_by = req.payload.username;
	institution.last_modification_time = today.getTime();

	institution.save(function(err, inst){
		if(err){ return next(err); }

		res.json(inst);
	});
});


/* GET - Reading one */
router.get('/:id', auth, function(req, res) {
	
	Institution.findById({ _id: req.params.id }, function (err, inst){
		if(err){ 
			res.status(404).json(err);
			return; 
		}
		if (!inst) { 
			res.status(404).json({message: 'can\'t find Institution'});
			return;
		}		
		res.json(inst);	
	});
	
});


/* PUT - Updating one */
router.put('/:id', auth, function(req, res){
    
    Institution.findById({ _id: req.params.id }, function (err, inst){
		if(err){ 
			res.status(404).json(err);
			return; 
		}
		if (!inst) { 
			res.status(404).json({message: 'Can\'t find Institution'});
			return;
		}
		inst.updateFields(req.body);		
		inst.save(function(err, inst){ 
			if (err) {
				console.log('There was an error saving to the database: ' + err);
				res.status(404).json(err);
				return;
			}
			res.status(201).json(inst);
		})
		
	});

    /// FIND OUT WHY Mongoose Methods findOneAndUpdate and findByIdAndUpdate aren't working
	/*
    Institution.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, inst) {
        if (err) { 
        	console.log(err);
        	res.status(404).json(err); 
        	return;
        }
        else {        				
            res.json(inst);
        }
    });
    */

});

/* DELETE - Deleting one */
router.delete('/:id', auth, function(req, res){
    
    Institution.remove({ _id: req.params.id }, function(err, institution){
        if (err) throw err;

        res.json(institution);
    });
});



module.exports = router;

