const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const routes = require("./src/routes/index.js");
require('dotenv').config();

const app = express();

//Mongo URI
const mongoDB = process.env.MONGODB_URI || "mongodb://localhost:27017/orderfood";

//Catching error
main().catch((err) => console.log(err));

//Connecting Database 
async function main() {
    await mongoose.connect(mongoDB);
    console.log("Connected to MongoDB");
}

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
const corsOptions = {
    origin: ['http://localhost:5173',
        'https://onpacecoder.github.io', 'https://food-nation-priyank.netlify.app'],
    credentials: true,
};
app.use(cors(corsOptions));

//Logging Requests
app.use((req, res, next) => {
    console.log(`Received request for route: ${req.originalUrl}`);
    next()
});


//Application Routes
routes(app)

// Fallback Route
app.use("/", (req, res) => {
    res.send("Fallback Route - Hello World")
});

//Defining Port
const PORT = process.env.PORT || 3003;

//Server Listening on Port 
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log("MONGO_URI:", process.env.MONGODB_URI);
});

module.exports = app;