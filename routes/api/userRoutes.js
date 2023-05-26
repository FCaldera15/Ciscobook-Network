const router = require('express').Router();

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addNewFriend,
    deleteFriend
} = require('../../controllers/userController');

router.route('/').get(getUsers).post(createUser);

router
    .route('/:userId')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

router
    .route('/:userId/friends/:friendId')
    .post(addNewFriend)
    .delete(deleteFriend)

module.exports = router;