const express = require('express');
const router = express.Router();
const orangeHrmService = require('../service/OrangeHrmService');
const app = express();

app.use(express.json());

router.get('/employees/:id', async (req, res) => {
    try {
        const data = await orangeHrmService.getEmployee(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
});

router.post('/employees/:id/bonus', async (req, res) => {
    const { year, value } = req.body;
    try {
        const result = await orangeHrmService.addBonusSalary(req.params.id, year, value);
        res.json({ success: true, originalResponse: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add bonus' });
    }
});

app.listen(3000, () => {
    console.log('Node.js Integration Service running on port 3000');
});

module.exports = router;