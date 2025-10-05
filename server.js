const express = require('express');
const path = require('path');
const fs = require('fs');

// Import the answer module
const answerModule = require('./answer.js');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Health check endpoint for Cloud Run
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'personal-platform'
    });
});

// Main page
app.get('/', (req, res) => {
    res.json({
        message: 'Personal Platform API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            generate: '/api/generate'
        }
    });
});

// API endpoint for generating presentations
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, options = {} } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ 
                error: 'Prompt is required' 
            });
        }

        // Here you would integrate with the answer.js module
        // For now, return a success response
        const result = {
            success: true,
            prompt: prompt,
            options: options,
            timestamp: new Date().toISOString(),
            message: 'Presentation generation request received'
        };

        res.json(result);
    } catch (error) {
        console.error('Error in /api/generate:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: err.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not found',
        path: req.path 
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API endpoint: http://localhost:${PORT}/api/generate`);
});

module.exports = app;
