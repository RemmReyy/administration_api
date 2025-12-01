const axios = require('axios');
const qs = require('querystring');

class OrangeHrmService {
    constructor() {
        this.baseUrl = 'http://localhost:8888/symfony/web/index.php';
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    async authenticate() {
        if (this.accessToken && this.tokenExpiry > Date.now()) {
            return this.accessToken;
        }

        const body = qs.stringify({
            client_id: 'api_oauth_id',
            client_secret: 'oauth_secret',
            grant_type: 'password',
            username: 'demouser',
            password: '*Safb02da42Demo$',
            scope: "admin"
        });

        const reqConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            }
        };

        try {
            console.log("Authenticating with OrangeHRM...");
            const res = await axios.post(`${this.baseUrl}/oauth/issueToken`, body, reqConfig);

            if (res.data.error) throw new Error(res.data.error);

            this.accessToken = res.data['access_token'];
            this.tokenExpiry = Date.now() + (res.data['expires_in'] * 1000);

            return this.accessToken;
        } catch (error) {
            console.error("OrangeHRM Auth Error:", error.message);
            throw error;
        }
    }

    async getAuthHeaders() {
        const token = await this.authenticate();
        return {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        };
    }

    async getAllEmployees() {
        try {
            const authConfig = await this.getAuthHeaders();

            const res = await axios.get(`${this.baseUrl}/api/v1/employee/search`, authConfig);

            const rawList = res.data.data;

            return rawList.map(employee => ({
                id: employee.code,
                fullName: employee.fullName,
                jobTitle: employee.jobTitle,
            }));

        } catch (error) {
            console.error(`Error fetching all employees:`, error.message);
            throw error;
        }
    }

    async getEmployee(id) {
        try {
            const authConfig = await this.getAuthHeaders();
            const res = await axios.get(`${this.baseUrl}/api/v1/employee/${id}`, authConfig);

            const rawData = res.data.data;

            return {
                id: rawData.code,
                fullName: rawData.fullName,
                jobTitle: rawData.jobTitle,
                email: rawData.email,
                phone: rawData.phone
            };
        } catch (error) {
            console.error(`Error fetching employee ${id}:`, error.message);
            throw error;
        }
    }

    async addBonusSalary(employeeId, year, value) {
        try {
            const authConfig = await this.getAuthHeaders();

            const body = qs.stringify({
                year: year,
                value: value
            });

            authConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';

            const url = `${this.baseUrl}/api/v1/employee/${employeeId}/bonussalary`;

            const res = await axios.post(url, body, authConfig);
            return res.data;

        } catch (error) {
            console.error("Error adding bonus salary:", error.message);
            throw error;
        }
    }
}

module.exports = new OrangeHrmService();