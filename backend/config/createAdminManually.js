const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { db } = require('./DbConnection');
const User = require('../models/user.model');

const createAdmin = async () => {
    try {
        await db(); // Ensure MongoDB connection is established
        console.log('MongoDB Connection Established');

        const Email = "mehtab@gmail.com";
        const password = "1122";

        const isUser = await User.findOne({ Email });
        if (isUser) {
            console.log('User Already Exists');
            return;
        }

        const salt = await bcrypt.genSalt(10); // ✅ Must use `await`
        console.log("Salt:", salt);

        const hash = await bcrypt.hash(password, salt); // ✅ Must use `await`
        console.log("Hash:", hash);

        const admin = await User.create({
            Email,
            password: hash, // Now correctly hashed
            role: 'admin'
        });

        console.log('Admin Created:', admin);
    } catch (error) {
        console.error('Error:', error);
    }
};

createAdmin();
