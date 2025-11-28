const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const menuFile = path.join(__dirname, '../data/menu.json');

// Get all menu items
router.get('/', (req, res) => {
  try {
    const menuData = fs.readFileSync(menuFile, 'utf8');
    const menu = JSON.parse(menuData);
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load menu' });
  }
});

module.exports = router;
