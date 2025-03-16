const mongoose = require('mongoose');

const db = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/mapIntegration');
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('Error Connecting MongoDB:', err);
    }
};

module.exports = { db };
