const router = require('express').Router();

const {
  getUsers,
  getUserbyId,
  editProfile,
  editAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserbyId);
router.patch('/me', editProfile);
router.patch('/me/avatar', editAvatar);

module.exports = router;
