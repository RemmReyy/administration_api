const axios = require('axios');
const qs = require('querystring');

class OpenCrxService {
    constructor() {
        this.baseUrl = "http://localhost:8887/opencrx-rest-CRX";
        this.accountPath = 'org.opencrx.kernel.account1/provider/CRX/segment/Standard/account';
        this.orderPath = 'org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder';
        this.productPath = 'org.opencrx.kernel.product1/provider/CRX/segment/Standard/product';

        this.authConfig = {
            auth: {
                username: "guest",
                password: "guest"
            },
            headers: {
                'Accept': 'application/json'
            }
        };
    }

    _extractId(href) {
        if (!href) return null;
        const parts = href.split('/');
        return parts[parts.length - 1];
    }

    _mapRating(rating) {
        const ratingMap = {
            0: 'No Rating',
            1: 'Excellent',
            2: 'Very good',
            3: 'Good',
            4: 'Average',
            5: 'Poor'
        };
        return ratingMap[rating] || 'Unknown';
    }

    async getAllAccounts() {
        try {
            const url = `${this.baseUrl}/${this.accountPath}`;
            const res = await axios.get(url, this.authConfig);

            return res.data.objects.map(obj => {
                const id = this._extractId(obj.href || obj.identity);

                return {
                    id: id,
                    fullName: obj.fullName,
                    jobTitle: obj.jobTitle,
                    department: obj.department,
                    ranking: this._mapRating(obj.accountRating),
                    email: obj.emailAddress1,
                    phone: obj.phoneNumberFull
                };
            });
        } catch (error) {
            console.error('Error fetching accounts:', error.message);
            throw new Error('OpenCRX Account Service Unavailable');
        }
    }

    async getAccountById(uid) {
        const url = `${this.baseUrl}/${this.accountPath}/${uid}`;

        try {
            const res = await axios.get(url, this.authConfig);
            return res.data;
        } catch (error) {
            console.error(`OpenCRX Account ${uid} Error:`, error.message);
            throw error;
        }
    }

    async getSalesPerformance(year) {
        try {
            const url = `${this.baseUrl}/${this.orderPath}`;
            const res = await axios.get(url, this.authConfig);

            const orders = res.data.objects;
            const performanceMap = {};

            orders.forEach(order => {
                const orderYear = new Date(order.createdAt).getFullYear();

                if (orderYear.toString() === year.toString()) {


                    const salesmanId = this._extractId(order.salesRep['@href']);
                    const customerId = this._extractId(order.customer['@href']);

                    if (salesmanId) {
                        if (!performanceMap[salesmanId]) {
                            performanceMap[salesmanId] = {
                                totalRevenue: 0,
                                clients: new Set()
                            };
                        }
                        performanceMap[salesmanId].totalRevenue += parseFloat(order.totalBaseAmount || 0);
                        if (customerId) {
                            performanceMap[salesmanId].clients.add(customerId);
                        }
                    }

                }
            });

            const result = Object.keys(performanceMap).map(id => ({
                salesmanId: id,
                year: year,
                totalRevenue: parseFloat(performanceMap[id].totalRevenue.toFixed(2)),
                servedClients: Array.from(performanceMap[id].clients)
            }));

            return result;

        } catch (error) {
            console.error('Error fetching sales orders:', error.message);
            throw new Error('OpenCRX Sales Service Unavailable');
        }
    }

    async getSalesPerformanceById(year, salesmanId) {
        try {
            const url = `${this.baseUrl}/${this.orderPath}`;
            const res = await axios.get(url, this.authConfig);

            const orders = res.data.objects;
            const performanceMap = {};

            orders.forEach(order => {
                const orderYear = new Date(order.createdAt).getFullYear();

                if (orderYear.toString() === year.toString()) {

                    const salesRepRef = this._extractId(order.salesRep['@href']);
                    const customerId = this._extractId(order.customer['@href']);

                    if (salesRepRef === salesmanId) {
                        if (!performanceMap[salesmanId]) {
                            performanceMap[salesmanId] = {
                                totalRevenue: 0,
                                clients: new Set()
                            };
                        }
                        performanceMap[salesmanId].totalRevenue += parseFloat(order.totalBaseAmount || 0);
                        if (customerId) {
                            performanceMap[salesmanId].clients.add(customerId);
                        }
                    }
                }
            });

            const result = Object.keys(performanceMap).map(id => ({
                salesmanId: id,
                year: year,
                totalRevenue: parseFloat(performanceMap[id].totalRevenue.toFixed(2)),
                servedClients: Array.from(performanceMap[id].clients)
            }));

            return result;

        } catch (error) {
            console.error('Error fetching sales orders:', error.message);
            throw new Error('OpenCRX Sales Service Unavailable');
        }
    }

    async getAllProducts() {
        try {
            const url = `${this.baseUrl}/${this.productPath}`;
            const res = await axios.get(url, this.authConfig);

            return res.data.objects.map(obj => ({
                id: this._extractId(obj['@href']),
                productNumber: obj.productNumber,
                name: obj.name,
                description: obj.description,
                price: parseFloat(obj.grossBaseAmount || 0),
                active: !obj.disabled
            }));
        } catch (error) {
            console.error('OpenCRX Product Error:', error.message);
            throw new Error('Could not fetch products');
        }
    }

    async getAllSalesOrders() {
        try {
            const url = `${this.baseUrl}/${this.orderPath}`;
            const res = await axios.get(url, this.authConfig);

            return res.data.objects.map(obj => {

                return {
                    id: this._extractId(obj['@href']),
                    orderNumber: obj.contractNumber,
                    name: obj.name,
                    amount: parseFloat(obj.totalBaseAmount),
                    currency: obj.contractCurrency,
                    createdAt: obj.createdAt,
                    salesRepId: this._extractId(obj.salesRep['@href']),
                    customerId: this._extractId(obj.customer['@href']),
                    status: obj.contractState
                };
            });
        } catch (error) {
            console.error('OpenCRX Order Error:', error.message);
            throw new Error('Could not fetch sales orders');
        }
    }

    async getCompanies() {
        try {
            const url = `${this.baseUrl}/${this.accountPath}`;
            const res = await axios.get(url, this.authConfig);

            const companies = res.data.objects.filter(obj => {
                return obj.name && !obj.firstName && !obj.name.includes('admin') && !obj.name.includes('guest');
            });

            return companies.map(comp => ({
                id: this._extractId(comp.href || comp.identity),
                companyName: comp.name,
                fullAddress: comp.aliasName,
                rating: this._mapRating(comp.accountRating),
                industry: comp.industry
            }));

        } catch (error) {
            console.error('OpenCRX Companies Error:', error.message);
            throw new Error('Could not fetch companies');
        }
    }
}

module.exports = new OpenCrxService();