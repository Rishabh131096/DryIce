const UserEntity = require('../models/userEntity.model.js');

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if(!(req.body.name && req.body.email && req.body.password)) {
        return res.status(400).send({
            message: "User name, email,password can not be empty"
        });
    }

    var user = new UserEntity({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        imgUrl: req.body.imgUrl,
        password: req.body.password,
        walletBalance: 0
    });

    // Save User in the database
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating user."
        });
    });
};

// Retrieve and return all Users
exports.findAll = (req, res) => {
    UserEntity.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

// Retrieve one User based on name
exports.findOne = (req, res) => {
    UserEntity.findOne({"name": req.body.name}, function(err,userObj) {res.send(userObj)});
};

// Update a User
exports.update = (req, res) => {
	UserEntity.findOneAndUpdate({'name': req.body.name},{name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        imgUrl: req.body.imgUrl,
        password: req.body.password,
        walletBalance: req.body.walletBalance}, {new: true}, function(err,obj) {res.send(obj)});
};

// Delete a User
exports.delete = (req, res) => {
    UserEntity.findOneAndRemove({'name': req.body.name}, function(err,obj) {res.send({message: "User deleted successfully!"});});
	
};