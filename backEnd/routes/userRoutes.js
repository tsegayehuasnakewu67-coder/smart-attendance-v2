const router = require('express').Router();
const {
  getAllUsers, getUserById, updateUser, deleteUser, updateFace, getDepartments,
} = require('../controllers/userController');
const { protect, adminOnly, employeeOrAdmin } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/',                adminOnly,       getAllUsers);
router.get('/departments',     adminOnly,       getDepartments);
router.get('/:id',             employeeOrAdmin, getUserById);
router.put('/:id',             adminOnly,       updateUser);
router.delete('/:id',          adminOnly,       deleteUser);
router.patch('/:id/face',      adminOnly,       updateFace);

module.exports = router;
