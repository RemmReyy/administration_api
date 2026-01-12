const chai = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const expect = chai.expect;

const orangeHrmService = require('../service/OrangeHrmService');
const openCrxService = require('../service/OpenCrxService');

describe('Integration Tests with Stubs', function () {

    // 1. OrangeHRM Service Tests
    describe('OrangeHRM Service', function () {
        let axiosPostStub;
        let axiosGetStub;

        beforeEach(() => {
            axiosPostStub = sinon.stub(axios, 'post');
            axiosGetStub = sinon.stub(axios, 'get');
        });

        afterEach(() => {
            axiosPostStub.restore();
            axiosGetStub.restore();
        });

        describe('Service is online (reachable)', function () {
            it('should authenticate and return employee data when service is reachable', async function () {
                axiosPostStub.resolves({
                    data: { access_token: 'mock-token', expires_in: 3600 }
                });

                axiosGetStub.resolves({
                    data: {
                        data: {
                            code: '101',
                            fullName: 'John Doe',
                            jobTitle: 'Sales',
                            email: 'john@gmail.com',
                            phone: '1234567890'
                        }
                    }
                });

                const employee = await orangeHrmService.getEmployee('101');

                expect(employee).to.be.an('object');
                expect(employee.fullName).to.equal('John Doe');
            });
        });

        describe('Service is offline (not reachable)', function () {
            it('should throw an error when OrangeHRM is offline', async function () {
                axiosPostStub.resolves({
                    data: { access_token: 'mock-token', expires_in: 3600 }
                });

                axiosGetStub.rejects(new Error('Network Error'));

                try {
                    await orangeHrmService.getEmployee('101');
                } catch (err) {
                    expect(err).to.exist;
                    expect(err.message).to.equal('Network Error');
                }
            });
        });
    });

    // 2. OpenCRX Service Tests
    describe('OpenCRX Service', function () {
        let axiosGetStub;

        beforeEach(() => {
            axiosGetStub = sinon.stub(axios, 'get');
        });

        afterEach(() => {
            axiosGetStub.restore();
        });

        describe('Service is online (reachable)', function () {
            it('should return a list of accounts when service is reachable', async function () {
                const mockAccounts = {
                    objects: [
                        {
                            identity: 'org.opencrx.../account/CRX001',
                            fullName: 'Example Corp',
                            accountRating: 1
                        }
                    ]
                };
                axiosGetStub.resolves({ data: mockAccounts });

                const accounts = await openCrxService.getAllAccounts();

                expect(accounts).to.be.an('array');
                expect(accounts[0].fullName).to.equal('Example Corp');
                expect(accounts[0].id).to.equal('CRX001');
            });
        });

        describe('Service is offline (not reachable)', function () {
            it('should throw a specific error when OpenCRX is offline', async function () {
                axiosGetStub.rejects(new Error('Connection Refused'));

                try {
                    await openCrxService.getAllAccounts();
                } catch (err) {
                    expect(err.message).to.equal('OpenCRX Account Service Unavailable');
                }
            });
        });
    });
});