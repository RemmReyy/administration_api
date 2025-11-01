const express = require('express');
const router = express.Router();
const { salesmen } = require('../data/salesmen');
const { records } = require('../data/performance');

// GET /api/salesmen → readAllSalesMen()
router.get('/', (req, res) => {
    res.json(salesmen);
});

// GET /api/salesmen/:sid → readSalesMan(sid)
router.get('/:sid', (req, res) => {
    const sid = parseInt(req.params.sid);
    const salesman = salesmen.find(s => s.sid === sid);
    if (!salesman) return res.status(404).json({ error: 'Salesman not found' });
    res.json(salesman);
});

// POST /api/salesmen → createSalesMan
router.post('/', (req, res) => {
    const { firstname, lastname, sid } = req.body;
    if (!firstname || !lastname || !sid) {
        return res.status(400).json({ error: 'firstname, lastname, sid required' });
    }
    if (salesmen.some(s => s.sid === sid)) {
        return res.status(400).json({ error: 'sid already exists' });
    }

    const newSalesman = { firstname, lastname, sid };
    salesmen.push(newSalesman);
    res.status(201).json(newSalesman);
});

// DELETE /api/salesmen/:sid → deleteSalesMan(sid)
router.delete('/:sid', (req, res) => {
    const sid = parseInt(req.params.sid);
    const index = salesmen.findIndex(s => s.sid === sid);
    if (index === -1) return res.status(404).json({ error: 'Salesman not found' });

    // delete all records
    for (let i = records.length - 1; i >= 0; i--) {
        if (records[i].goalId === sid) {
            records.splice(i, 1);
        }
    }

    salesmen.splice(index, 1);
    res.status(204).send();
});

module.exports = router;