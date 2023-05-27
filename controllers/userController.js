const { User, Thought } = require("../models");

module.exports = {
    // get all of users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // get a single user by id
    async getUserById(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .select("-__v")
                .populate("thoughts", "friends");
            if (!user) {
                return res.status(404).json({ message: "No user with that ID" });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // create a new user
    async createUser(req, res) {
        try {
            const dbUserData = await User.create(req.body);
            res.json(dbUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Update a user
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!user) {
                res.status(404).json({ message: 'No user with this id!' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //delete a user
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if (!user) {
                res.status(404).json({ message: 'No user with that ID' });
            }
            // removed a user's associated thoughts when deleted
            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: 'User and thoughts deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Add friend
    async addNewFriend(req, res) {
        try {
            const addFriend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $push: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if (!addFriend) {
                return res.status(404).json({ message: 'No friend with this id!' });
            }

            res.json(addFriend);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // deleting friend
    async deleteFriend(req, res) {
        try {
            const deleteFriend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if (!deleteFriend) {
                return res.status(404).json({ message: 'No friend with this id!' });
            }

            res.json(deleteFriend);
        } catch (err) {
            res.status(500).json(err);
        }
    },

};
