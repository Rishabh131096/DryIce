const Calendar = require('../models/calendar.model.js');

var schedule = require('node-schedule');
 
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(0, 6)];
rule.hour = 0;
//rule.minute = 7;
//rule.second = 30;
 
var j = schedule.scheduleJob(rule, function(){
	var d = new Date();
	var Year = d.getFullYear();
	var Month = (d.getMonth() +1);
	var DayOfMonth = d.getDate();
	
	console.log(Year + " " + Month + " " + DayOfMonth);
	
	Calendar.deleteMany({ year: { $lt: Year } }, function(err, obj) {
		if (err) throw err;
		console.log(obj.n+" YEAR document(s) deleted");
		console.log(JSON.stringify(obj) +"");
	});
	
	Calendar.deleteMany({ year: Year, month: { $lt: Month } }, function(err, obj) {
		if (err) throw err;
		console.log(obj.n+" MONTH document(s) deleted");
		console.log(JSON.stringify(obj) +"");
	});
	
	Calendar.deleteMany({ year: Year, month: Month, day: { $lt: DayOfMonth } }, function(err, obj) {
		if (err) throw err;
		console.log(obj.n+" DAY document(s) deleted");
		console.log(JSON.stringify(obj) +"");
	});
	
});


// Create and Save a new Date
exports.create = (req, res) => {
    // Validate request
    if(!(req.body.day && req.body.month && req.body.year)) {
        return res.status(400).send({
            message: "Calendar date can not be empty"
        });
    }

    // Create a Date
    const calendar = new Calendar({
        day: req.body.day,
		month: req.body.month,
		year: req.body.year,
		holiday: req.body.holiday,
        list:[]
    });

    // Save Date in the database
    calendar.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the calendar."
        });
    });
};

exports.adminAppCreate = (req, res) => {
    // Validate request
    if(!(req.body.day && req.body.month && req.body.year)) {
        return res.status(400).send({
            message: "Calendar date can not be empty"
        });
    }
	
	Calendar.countDocuments({"day": req.body.day, "month": req.body.month, "year": req.body.year}, function(err, count) {
		delete req.body.list[0]._id;
		if(count>0){
			Calendar.findOneAndUpdate({'day': req.body.day, 'month': req.body.month, 'year': req.body.year},{$push:{'list': req.body.list}}, function(err,obj) {res.send(obj)});
		}
		else{
			// Create a Date
			const calendar = new Calendar({
				day: req.body.day,
				month: req.body.month,
				year: req.body.year,
				holiday: req.body.holiday,
				list: req.body.list
			});

			// Save Date in the database
			calendar.save()
			.then(data => {
				res.send(data);
			}).catch(err => {
				res.status(500).send({
					message: "Some error occurred while creating the calendar."
				});
			});
		}
	});
		
};

// Retrieve and return all calendar from the database.
exports.findAll = (req, res) => {
    Calendar.find()
    .then(calendar => {
        res.send(calendar);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving calendar."
        });
    });
};

// Find events with a date
exports.findOne = (req, res) => {
    Calendar.findOne({"day": req.params.day, "month": req.params.month, "year": req.params.year}, function(err,obj) {res.send(obj)});
	//res.send(temp);
};

// Update a date identified by date in the request with event in the request
exports.update = (req, res) => {
	Calendar.findOneAndUpdate({'day': req.params.day, 'month': req.params.month, 'year': req.params.year},{$push:{'list': req.body}}, function(err,obj) {res.send(obj)});
};

// Update a date holiday identified by date in the request with event in the request
exports.updateHoliday = (req, res) => {
	Calendar.findOneAndUpdate({'day': req.params.day, 'month': req.params.month, 'year': req.params.year},{'holiday': req.body.holiday}, function(err,obj) {res.send(obj)});
};

// Delete a date with the specified date in the request
exports.delete = (req, res) => {
    Calendar.findOneAndRemove({'day': req.params.day, 'month': req.params.month, 'year': req.params.year}, function(err,obj) {res.send({message: "Date deleted successfully!"});});
	
};

exports.adminAppDeleteId = (req, res) => {
	Calendar.findOneAndRemove({'_id': req.params._id}, function(err,obj) {res.send({message: "Date Deleted successfully"});});
};

exports.adminAppDeleteEvent = (req, res) => {
	Calendar.findOneAndUpdate({'_id': req.body._idDay},{$pull:{'list': {'_id': req.body._idList}}}, function(err,obj) {res.send({message: "Event Deleted successfully"});});
};

exports.adminAppDeleteEventWithDate = (req, res) => {
	Calendar.findOneAndUpdate({'day': req.params.day, 'month': req.params.month, 'year': req.params.year},{$pull:{'list': {'_id': req.body._id}}}, function(err,obj) {res.send({message: "Event Deleted successfully"});});
};