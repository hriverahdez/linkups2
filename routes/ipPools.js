var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var IpPool = mongoose.model('IpPool');
var secret = process.env.secret;
var jwt = require('express-jwt');

var auth = jwt({secret: secret, userProperty: 'payload'});

/* GET - Reading all */
router.get('/', function(req, res, next) {

	IpPool.find(function(err, pool){
		if(err){ return next(err); }

		res.json(pool);
	});
});

/* POST - Creating one */
router.post('/', auth, function(req, res, next) {	


	if (req.body.length > 0) {		

		var data = Array.prototype.slice.call(req.body);

		IpPool.insertMany(data)
		.then(function(data){
			console.log('ok');
			res.status(201).json(data);
		})
		.catch(function(err){
			console.log(err);
			res.status(404).json(err);
		});
	} else { 
		var ipPool = new IpPool(req.body);

		ipPool.save(function(err, pool){
			if(err){ return next(err); }

			res.json(pool);
		});
	}	

});


/* GET - Reading one */
router.get('/:id', function(req, res) {
	
	IpPool.findById({ _id: req.params.id }, function (err, pool){
		if(err){ 
			res.status(404).json(err);
			return; 
		}
		if (!pool) { 
			res.status(404).json({message: 'can\'t find IpPool'});
			return;
		}		
		res.json(pool);	
	});
	
});


/* PUT - Updating one */
router.put('/:id', function(req, res){

    IpPool.findById({ _id: req.params.id }, function (err, pool){
		if(err){ 
			res.status(404).json(err);
			return; 
		}
		if (!pool) { 
			res.status(404).json({message: 'Can\'t find IpPool'});
			return;
		}
		pool.updateFields(req.body);		
		pool.save(function(err, pool){ 
			if (err) {
				console.log('There was an error saving to the database: ' + err);
				res.status(404).json(err);
				return;
			}
			res.status(201).json(pool);
		})
		
	});

});

/* DELETE - Deleting one */
router.delete('/:id', auth, function(req, res){

    IpPool.remove({ _id: req.params.id }, function(err, ipPool){
        if (err) throw err;

        res.json(ipPool);
    });

});

router.post('/deleteAll', auth, function(req, res){

    IpPool.remove({}, function(err){
        if (err) console.log(err);

        res.json({message: "ok"});
    });

});

module.exports = router;

