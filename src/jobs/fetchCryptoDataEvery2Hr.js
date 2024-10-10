const cron = require('node-cron');
const axios = require('axios');
const Crypto = require('../models/Crypto');

const fetchCryptoDataEvery2Hr = () => {
    cron.schedule('0 */2 * * *', async () => {
        try {
            console.log("object")
            const response = await axios.get(
                'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,matic-network,ethereum&vs_currencies=usd&include_market_cap=true&include_24hr_change=true'
            );
            const { bitcoin, 'matic-network': matic, ethereum } = response.data;

            const cryptoData = [
                {
                    name: 'bitcoin',
                    price: bitcoin.usd,
                    marketCap: bitcoin.usd_market_cap,
                    change: bitcoin.usd_24h_change,
                },
                {
                    name: 'matic-network',
                    price: matic.usd,
                    marketCap: matic.usd_market_cap,
                    change: matic.usd_24h_change,
                },
                {
                    name: 'ethereum',
                    price: ethereum.usd,
                    marketCap: ethereum.usd_market_cap,
                    change: ethereum.usd_24h_change,
                },
            ];

            //if updation only is required then use this

            // for (const data of cryptoData) {
            //     const existingCrypto = await Crypto.findOne({ name: data.name });
            //     if (existingCrypto) {
            //         await Crypto.updateOne({ name: data.name }, data);
            //     } else {
            //         await Crypto.create(data);
            //     }
            // } 
            await Crypto.insertMany(cryptoData);
            console.log('Crypto data fetched and stored successfully.');
        } catch (error) {
            console.error('Error fetching crypto data:', error);
        }
    });
};
module.exports = fetchCryptoDataEvery2Hr;
