const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const route = require('./routes/route');

const app = express();
route(app);

// MongoDB connection
const uri = process.env.MONGO_URI;
const clientOptions = {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    },
};

async function main() {
    try {
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("MongoDB connected successfully.");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

main();

app.listen(3000, () => {
    console.log('Server is running at port 3000');
});
