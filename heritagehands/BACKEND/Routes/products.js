const express = require('express');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        res.status(200).json({ message: "Get all products route" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        res.status(200).json({ message: "Get single product route" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create product
router.post('/', async (req, res) => {
    try {
        res.status(201).json({ message: "Create product route" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        res.status(200).json({ message: "Update product route" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        res.status(200).json({ message: "Delete product route" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 