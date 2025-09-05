const Item = require('../models/Item');
const path = require('path');
const fs = require('fs');

// @desc    Create a new found item
// @route   POST /api/items
// @access  Public
const createItem = async (req, res) => {
  try {
    const {
      itemName,
      dateFound,
      dateLost,
      timeFound,
      timeLost,
      foundLocation,
      lastLocation,
      itemDescription,
      fullName,
      matricNumber,
      phoneNumber,
      email,
      shareInfo = false,
      adminContact = false,
      status = 'found'
    } = req.body;

    // Create new item
    const itemData = {
      itemName,
      itemDescription,
      finderInfo: {
        fullName,
        matricNumber,
        phoneNumber,
        email
      },
      shareInfo,
      adminContact,
      status
    };

    // Add fields based on whether it's a lost or found item
    if (status === 'found') {
      itemData.dateFound = dateFound;
      itemData.timeFound = timeFound;
      itemData.foundLocation = foundLocation;
    } else {
      itemData.dateLost = dateLost;
      itemData.timeLost = timeLost;
      itemData.lastLocation = lastLocation;
    }

    const newItem = new Item(itemData);

    // Handle image upload
    if (req.file) {
      newItem.image = `/uploads/${req.file.filename}`;
    }

    await newItem.save();
    
    res.status(201).json({
      success: true,
      data: newItem
    });
  } catch (error) {
    console.error('Create item error:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(__dirname, '..', req.file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating item',
      error: error.message
    });
  }
};

// @desc    Get all found items
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }

    const items = await Item.find(query)
      .sort({ dateReported: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Item.countDocuments(query);

    res.json({
      success: true,
      count: items.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      data: items
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving items',
      error: error.message
    });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Get item by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving item',
      error: error.message
    });
  }
};

// @desc    Update item status (for admin)
// @route   PUT /api/items/:id/status
// @access  Private/Admin
const updateItemStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    item.status = status;
    await item.save();
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Update item status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating item status',
      error: error.message
    });
  }
};

// @desc    Delete an item (admin only)
// @route   DELETE /api/items/:id
// @access  Private/Admin
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    // Delete associated image if it exists
    if (item.image) {
      const filePath = path.join(__dirname, '..', item.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await item.remove();
    
    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting item',
      error: error.message
    });
  }
};

// @desc    Search items by name or description
// @route   GET /api/items/search
// @access  Public
const searchItems = async (req, res) => {
  try {
    const { q, status = 'found' } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Create search query using regex for case-insensitive search
    const searchRegex = new RegExp(q.trim(), 'i');
    
    const query = {
      status: status,
      $or: [
        { itemName: searchRegex },
        { itemDescription: searchRegex },
        { foundLocation: searchRegex },
        { lastLocation: searchRegex }
      ]
    };

    const items = await Item.find(query)
      .sort({ dateReported: -1 })
      .limit(20);

    res.json({
      success: true,
      count: items.length,
      data: items,
      query: q
    });
  } catch (error) {
    console.error('Search items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching items',
      error: error.message
    });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItemStatus,
  deleteItem,
  searchItems
};
