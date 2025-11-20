const express = require('express');
const router = express.Router();
const { getDb } = require('../data/db');

const getSalesmenCollection = () => getDb().collection('Salesmen');
const getCollection = () => getDb().collection('SocialPerformanceRecord');

// POST /api/performance → addSocialPerformanceRecord
router.post('/', async (req, res) => {
    try {
        const { goalId, goalDescription, valueSupervisor, valuePeerGroup, year } = req.body;

        if (!goalId || !goalDescription || !valueSupervisor || !valuePeerGroup || !year) {
            return res.status(400).json({ error: 'All fields required' });
        }

        const salesman = await getSalesmenCollection().findOne({ sid: parseInt(goalId) });
        if (!salesman) {
            return res.status(400).json({ error: 'Salesman with this goalId not found' });
        }

        const newRecord = {
            goalId: parseInt(goalId),
            goalDescription,
            valueSupervisor: parseFloat(valueSupervisor),
            valuePeerGroup: parseFloat(valuePeerGroup),
            year: parseInt(year)
        };

        await getCollection().insertOne(newRecord);
        res.status(201).json(newRecord);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/performance/salesman/:sid → readSocialPerformanceRecord(salesMan)
router.get('/salesman/:sid', async (req, res) => {
    try {
        const sid = parseInt(req.params.sid);
        const records = await getCollection()
            .find({ goalId: sid })
            .project({ _id: 0 })
            .toArray();
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/performance/salesman/:sid/year/:year
router.get('/salesman/:sid/year/:year', async (req, res) => {
    try {
        const sid = parseInt(req.params.sid);
        const year = parseInt(req.params.year);

        // Використовуємо фільтр AND (goalId + year)
        const records = await getCollection()
            .find({ goalId: sid, year: year })
            .project({ _id: 0 })
            .toArray();

        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/performance → updateSalesmanSocialPerformanceRecord
router.put('/', async (req, res) => {
    try {
        const { sid, description, newValueSupervisor, newValuePeerGroup } = req.body;

        if (!sid || !description || newValueSupervisor == null || newValuePeerGroup == null) {
            return res.status(400).json({ error: 'All fields required' });
        }

        const filter = {
            goalId: parseInt(sid),
            goalDescription: description
        };

        const update = {
            $set: {
                valueSupervisor: parseFloat(newValueSupervisor),
                valuePeerGroup: parseFloat(newValuePeerGroup)
            }
        };

        const result = await getCollection().updateOne(filter, update);

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        // Повертаємо оновлений документ
        const updatedRecord = await getCollection().findOne(filter, { projection: { _id: 0 } });
        res.json(updatedRecord);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/performance → deleteSalesManSocialPerformanceRecord
router.delete('/', async (req, res) => {
    try {
        const { sid, description } = req.body;
        if (!sid || !description) return res.status(400).json({ error: 'sid and description required' });

        const result = await getCollection().deleteOne({
            goalId: parseInt(sid),
            goalDescription: description
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;