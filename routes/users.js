const router = require('express').Router();

const {
  getUsers,
  getUserbyId,
  createUser,
  editProfile,
  editAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserbyId);
router.post('/', createUser);
router.patch('/me', editProfile);
router.patch('/me/avatar', editAvatar);

module.exports = router;
