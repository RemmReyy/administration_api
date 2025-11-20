const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'HighPerformance';
const client = new MongoClient(url);

let db = null;

async function connect() {
    if (!db) {
        await client.connect();
        console.log('Connected successfully to MongoDB server');
        db = client.db(dbName);
    }
    return db;
}

function getDb() {
    return db;
}

module.exports = { connect, getDb };