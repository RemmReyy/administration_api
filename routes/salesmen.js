const express = require('express');
const router = express.Router();
const { getDb } = require('../data/db');

const getCollection = () => getDb().collection('Salesmen');
const getPerformanceCollection = () => getDb().collection('SocialPerformanceRecord');

// GET /api/salesmen → readAllSalesMen()
router.get('/', async (req, res) => {
    try {
        const salesmen = await getCollection().find({}).project({ _id: 0 }).toArray();
        res.json(salesmen);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/salesmen/:sid → readSalesMan(sid)
router.get('/:sid', async (req, res) => {
    try {
        const sid = parseInt(req.params.sid);
        const salesman = await getCollection().findOne({ sid: sid }, { projection: { _id: 0 } });

        if (!salesman) return res.status(404).json({ error: 'Salesman not found' });
        res.json(salesman);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/salesmen → createSalesMan
router.post('/', async (req, res) => {
    try {
        const { firstname, lastname, sid } = req.body;
        if (!firstname || !lastname || !sid) {
            return res.status(400).json({ error: 'firstname, lastname, sid required' });
        }

        const collection = getCollection();
        const existing = await collection.findOne({ sid: parseInt(sid) });

        if (existing) {
            return res.status(400).json({ error: 'sid already exists' });
        }

        const newSalesman = {
            firstname,
            lastname,
            sid: parseInt(sid)
        };

        await collection.insertOne(newSalesman);
        res.status(201).json(newSalesman);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/salesmen/:sid → deleteSalesMan(sid)
router.delete('/:sid', async (req, res) => {
    try {
        const sid = parseInt(req.params.sid);
        const collection = getCollection();

        const result = await collection.deleteOne({ sid: sid });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Salesman not found' });
        }

        await getPerformanceCollection().deleteMany({ goalId: sid });

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;