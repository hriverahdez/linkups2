var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var InstitutionRequest = mongoose.model('InstitutionRequest');
var secret = process.env.secret;
var jwt = require('express-jwt');

var auth = jwt({secret: secret, userProperty: 'payload'});

/* GET - Reading all */
router.get('/', auth, function(req, res, next) {

	InstitutionRequest.find({createdBy: req.payload.username}, function(err, instReq){
		if(err){ return next(err); }

		res.json(instReq);
	});
});

/* POST - Creating one */
router.post('/', function(req, res, next) {	
		
	var instRequest = new InstitutionRequest(req.body);
	var today = new Date();    
	//instRequest.createdBy = req.payload.username;
	instRequest.createdAt = today.getTime();

	instRequest.save(function(err, instReq){
		if(err){ return next(err); }

		res.json(instReq);
	});
});


/* GET - Reading one */
router.get('/:id', function(req, res) {
	
	InstitutionRequest.findById({ _id: req.params.id }, function (err, instReq){
		if(err){ 
			res.status(404).json(err);
			return; 
		}
		if (!instReq) { 
			res.status(404).json({message: 'can\'t find Request'});
			return;
		}		
		res.json(instReq);	
	});
	
});


/* PUT - Updating one */
router.put('/:id', function(req, res){
    
    InstitutionRequest.findById({ _id: req.params.id }, function (err, instReq){
		if(err){ 
			res.status(404).json(err);
			return; 
		}
		if (!instReq) { 
			res.status(404).json({message: 'Can\'t find Request'});
			return;
		}
		instReq.updateFields(req.body);		
		instReq.save(function(err, instReq){ 
			if (err) {
				console.log('There was an error saving to the database: ' + err);
				res.status(404).json(err);
				return;
			}
			res.status(201).json(instReq);
		})
		
	});

});

/* DELETE - Deleting one */
router.delete('/:id', function(req, res){
    
    InstitutionRequest.remove({ _id: req.params.id }, function(err, instReq){
        if (err) throw err;

        res.json(instReq);
    });
});



module.exports = router;

