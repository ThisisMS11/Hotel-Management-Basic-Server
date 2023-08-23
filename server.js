const express = require('express');
const app = express();
require('dotenv').config();


const PORT = process.env.PORT || 8000
const cors = require('cors');
const connectDB = require('./connectToDB');

/* routes */
const user = require('./routes/user');
const hotel = require('./routes/hotel');

connectDB();

app.use(express.json());
app.use(cors());

/* routes */
app.use('/api/v1/user', user);
app.use('/api/v1/hotel', hotel);


app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})