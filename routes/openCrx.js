const express = require('express');
const router = express.Router();
const openCrxService = require('../service/openCrxService');
const orangeHrmService = require('../service/OrangeHrmService');

// GET /api/open/salesmen
// Filters the accounts to show only Salesmen
router.get('/salesmen', async (req, res) => {
    try {
        const [orangeEmployees, crxAccounts] = await Promise.all([
            orangeHrmService.getAllEmployees(),
            openCrxService.getAllAccounts()
        ]);

        const salesmenList = orangeEmployees
            .filter(emp => emp.jobTitle && emp.jobTitle.toLowerCase().includes('sales'))
            .map(emp => {
                let transformedName = emp.fullName;
                const parts = transformedName.trim().split(' ');

                const lastName = parts.pop();

                const firstName = parts.join(' ');

                transformedName = `${lastName}, ${firstName}`;

                const crxMatch = crxAccounts.find(s => s.fullName === transformedName);

                if (!crxMatch) return null;

                return {
                    id: req.params.id,
                    orangeHrmId: emp.code || emp.id,
                    openCrxId: crxMatch.id,
                    fullName: crxMatch.fullName,
                    department: crxMatch.department,
                    jobTitle: crxMatch.jobTitle
                };
            })
            .filter(item => item !== null);

        res.json(salesmenList);

    } catch (err) {
        console.error("Error fetching salesmen list:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/open/salesmen
// Filters the accounts to show only Salesmen
router.get('/salesmen/:id', async (req, res) => {
    try {
        const account = await orangeHrmService.getEmployee(req.params.id);

        if (!account) {
            return res.status(404).json({ message: "Salesman not found" });
        }

        const allAccounts = await openCrxService.getAllAccounts();

        let transformedName = account.fullName;
        const parts = transformedName.trim().split(' ');

        const lastName = parts.pop();

        const firstName = parts.join(' ');

        transformedName = `${lastName}, ${firstName}`;
        const salesman = allAccounts.find(s => s.fullName === transformedName);

        if (!salesman) {
            return res.status(404).json({ message: "Salesman not found" });
        }

        const answer = {
            id: req.params.id,
            orangeHrmId: account.id,
            openCrxId: salesman.id,
            fullName: salesman.fullName,
            department: salesman.department,
            jobTitle: salesman.jobTitle,
            email: account.email,
            phone: account.phone
        };

        res.json(answer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/performance/:year', async (req, res) => {
    try {
        const year = req.params.year;
        const performance = await openCrxService.getSalesPerformance(year);
        res.json(performance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/performance/:year/:id', async (req, res) => {
    try {
        const year = req.params.year;
        const id = req.params.id;
        const performance = await openCrxService.getSalesPerformanceById(year, id);
        res.json(performance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/products', async (req, res) => {
    try {
        const products = await openCrxService.getAllProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/orders', async (req, res) => {
    try {
        const orders = await openCrxService.getAllSalesOrders();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/orders/salesmen/:sid', async (req, res) => {
    try {
        const allOrders = await openCrxService.getAllSalesOrders();
        const filtered = allOrders.filter(o => o.salesRepId === req.params.sid);
        res.json(filtered);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/companies', async (req, res) => {
    try {
        const companies = await openCrxService.getCompanies();
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;