const express = require('express');
const router = express.Router();
const { 
  createItem, 
  getItems, 
  getItemById, 
  updateItemStatus, 
  deleteItem 
} = require('../controllers/itemController');
const { auth, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', upload.single('image'), createItem);

// Protected routes (admin only)
router.put('/:id/status', auth, admin, updateItemStatus);
router.delete('/:id', auth, admin, deleteItem);

module.exports = router;
