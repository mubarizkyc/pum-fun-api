const express = require('express');
const axios = require('axios');

const app = express();

const BASE_URL = process.env.ORIGINAL_API_BASE_URL;

if (!BASE_URL) {
    throw new Error('ORIGINAL_API_BASE_URL environment variable is not set');
}

app.use(express.json());

// Helper function to proxy requests
async function proxyRequest(req, res, path) {
    try {
        const response = await axios.get(`${BASE_URL}${path}`, {
            params: req.query
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error proxying request:', error.message);
        res.status(500).json({ error: 'An error occurred' });
    }
}
app.get('/test', (req, res) => {
    res.json({ message: 'Hi Babe' });
});
app.get('/users/:userName', (req, res) => proxyRequest(req, res, `/users/${req.params.userName}`));
app.get('/trades/latest', (req, res) => proxyRequest(req, res, '/trades/latest'));
app.get('/coins/latest', (req, res) => proxyRequest(req, res, '/coins/latest'));
app.get('/coins/:address', (req, res) => proxyRequest(req, res, `/coins/${req.params.address}`));
app.get('/coins/king-of-the-hill', (req, res) => proxyRequest(req, res, '/coins/king-of-the-hill'));
app.get('/coins', (req, res) => proxyRequest(req, res, '/coins'));
module.exports = app;