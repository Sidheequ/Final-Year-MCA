const express = require('express');
const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
    try {
        res.status(200).json({ message: "Get all orders route" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single order
router.get('/:id', async (req, res) => {
    try {
        res.status(200).json({ message: "Get single order route" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create order
router.post('/', async (req, res) => {
    try {
        res.status(201).json({ message: "Create order route" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order
router.put('/:id', async (req, res) => {
    try {
        res.status(200).json({ message: "Update order route" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete order
router.delete('/:id', async (req, res) => {
    try {
        res.status(200).json({ message: "Delete order route" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 