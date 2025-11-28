const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const ordersFile = path.join(__dirname, '../data/orders.json');

// Helper function to read orders
function readOrders() {
  try {
    const data = fs.readFileSync(ordersFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper function to write orders
function writeOrders(orders) {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

// Place new order
router.post('/', (req, res) => {
  try {
    const orders = readOrders();
    const newOrder = {
      id: Date.now().toString(),
      ...req.body,
      date: new Date().toISOString()
    };
    orders.unshift(newOrder); // Add to beginning
    writeOrders(orders);
    res.status(201).json({ message: 'Order placed successfully', orderId: newOrder.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Get all orders
router.get('/', (req, res) => {
  try {
    const orders = readOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

module.exports = router;
