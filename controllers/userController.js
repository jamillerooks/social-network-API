const { User, Thought } = require('../models');

// Aggregate function to get the number of users overall
const friendCount = async () =>
	User.aggregate()
		.count('friendCount')
		.then((numberOfFriends) => numberOfFriends);

module.exports = {
	// Get all users
	getUsers(req, res) {
		User.find()
			.populate({ path: 'thoughts', select: '-__v' })
			.populate({ path: 'friends', select: '-__v' })
			.select('-__v')
			.then(async (users) => {
		
				return res.json(users);
			})
			.catch((err) => {
				console.log(err);
				return res.status(500).json(err);
			});
	},
	// Get a single user
	getSingleUser(req, res) {
		User.findOne({ _id: req.params.userId })
			.populate({ path: 'thoughts', select: '-__v' })
			.populate({ path: 'friends', select: '-__v' })
			.select('-__v')
			.then(async (users) => {
			
				return res.json(users);
			})
			.catch((err) => {
				console.log(err);
				return res.status(500).json(err);
			});
	},
	// create a new user
	createUser(req, res) {
		User.create(req.body)
			.then((user) => res.json(user))
			.catch((err) => res.status(500).json(err));
	},

	// Update a user
	updateUser(req, res) {
		User.findOneAndUpdate(
			{ _id: req.params.userId },
			{ $set: req.body },
			{ runValidators: true, new: true }
		)
			.then((user) =>
				!user
					? res.status(404).json({ message: 'No user with this id!' })
					: res.json(user)
			)
			.catch((err) => res.status(500).json(err));
	},

	// Delete a user and remove them from the thought
	deleteUser(req, res) {
		User.findOneAndRemove({ _id: req.params.userId })
			.then((user) =>
				!user
					? res.status(404).json({ message: 'No such user exists' })
					: Thought.findOneAndUpdate(
							{ users: req.params.userId },
							{ $pull: { users: req.params.userId } },
							{ new: true }
					  )
			)
			.then((thought) =>
				!thought
					? res.status(404).json({
							message: 'User deleted, but no thoughts found',
					  })
					: res.json({ message: 'User successfully deleted' })
			)
			.catch((err) => {
				console.log(err);
				res.status(500).json(err);
			});
	},

	// Add an friend to a user
	addFriend(req, res) {
		console.log('You are adding an friend');
		console.log(req.body);
		User.findOneAndUpdate(
			{ _id: req.params.userId },
			{ $push: { friends: req.body.newFriend } },
			{ runValidators: true, new: true }
		)
			.populate({ path: 'friends', select: '-__v' })
			.select('-__v')

			.then((user) =>
				!user
					? res.status(404).json({ message: 'No user found with that ID :(' })
					: res.json(user)
			)
			.catch((err) => res.status(500).json(err));
	},
	// Remove friend from a user
	removeFriend(req, res) {
		User.findOneAndUpdate(
			{ _id: req.params.userId },
			{ $pull: { friends:  req.params.friendId } },
			{ runValidators: true, new: true }
		)
			.then((user) =>
				!user
					? res.status(404).json({ message: 'No user found with that ID :(' })
					: res.json(user)
			)
			.catch((err) => res.status(500).json(err));
	},
};
