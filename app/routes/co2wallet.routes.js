module.exports = (app) => {
	const user = require('../controllers/user.controller.js');
	
	//USER-API
	// Create a new User
    app.post('/createUser', user.create);

    // Retrieve all Users
    app.get('/getUsers', user.findAll);

    // Retrieve profile of User
    app.post('/getUserProfile', user.findOne);

    // Update profile of a User
    app.put('/updateUser', user.update);
	
    // Delete a User
    app.delete('/deleteUser', user.delete);
	
}