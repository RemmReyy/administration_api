// routes/performance.js
const express = require('express');
const router = express.Router();
const { records } = require('../data/performance');
const { salesmen } = require('../data/salesmen');

// POST /api/performance → addSocialPerformanceRecord
router.post('/', (req, res) => {
    const { goalId, goalDescription, valueSupervisor, valuePeerGroup, year } = req.body;
    if (!goalId || !goalDescription || valueSupervisor == null || valuePeerGroup == null || !year) {
        return res.status(400).json({ error: 'All fields required' });
    }
    if (!salesmen.some(s => s.sid === goalId)) {
        return res.status(400).json({ error: 'Salesman with this goalId not found' });
    }

    const newRecord = {
        goalId: Number(goalId),
        goalDescription,
        valueSupervisor: Number(valueSupervisor),
        valuePeerGroup: Number(valuePeerGroup),
        year: Number(year)
    };
    records.push(newRecord);
    res.status(201).json(newRecord);
});

// GET /api/performance/salesman/:sid → readSocialPerformanceRecord(salesMan)
router.get('/salesman/:sid', (req, res) => {
    const sid = parseInt(req.params.sid);
    const filtered = records.filter(r => r.goalId === sid);
    res.json(filtered);
});

// GET /api/performance/salesman/:sid/year/:year → readSocialPerformanceRecord(salesMan, year)
router.get('/salesman/:sid/year/:year', (req, res) => {
    const sid = parseInt(req.params.sid);
    const year = parseInt(req.params.year);
    const filtered = records.filter(r => r.goalId === sid && r.year === year);
    res.json(filtered);
});

// PUT /api/performance → updateSalesmanSocialPerformanceRecord
router.put('/', (req, res) => {
    const { sid, description, newValueSupervisor, newValuePeerGroup } = req.body;
    if (!sid || !description || newValueSupervisor == null || newValuePeerGroup == null) {
        return res.status(400).json({ error: 'All fields required' });
    }

    const record = records.find(r => r.goalId === sid && r.goalDescription === description);
    if (!record) return res.status(404).json({ error: 'Record not found' });

    record.valueSupervisor = newValueSupervisor;
    record.valuePeerGroup = newValuePeerGroup;
    res.json(record);
});

// DELETE /api/performance → deleteSalesManSocialPerformanceRecord
router.delete('/', (req, res) => {
    const { sid, description } = req.body;
    if (!sid || !description) return res.status(400).json({ error: 'sid and description required' });

    const index = records.findIndex(r => r.goalId === sid && r.goalDescription === description);
    if (index === -1) return res.status(404).json({ error: 'Record not found' });

    records.splice(index, 1);
    res.status(204).send();
});

module.exports = router;