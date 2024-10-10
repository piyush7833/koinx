const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const cryptoRoutes = require('./routes/cryptoRoutes');
const fetchCryptoDataEvery2Hr = require('./jobs/fetchCryptoDataEvery2Hr');

dotenv.config();

const app = express();

app.use(cors()); 
app.use(bodyParser.json()); 

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

fetchCryptoDataEvery2Hr();

app.use('/', cryptoRoutes);

app.get('/', (req, res) => {
    res.send('Koinx backend assignment');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
