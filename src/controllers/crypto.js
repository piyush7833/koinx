const Crypto = require("../models/Crypto");

const getStats = async (req, res) => {
  const { coin } = req.query;

  try {
    if(!coin) return res.status(400).send({ message: "Coin name is required" });

    const cryptoData = await Crypto.findOne({
      name: coin.toLowerCase(),
    }).sort({ createdAt: -1 });

    if (!cryptoData) return res.status(404).send({ message: "Coin not found" });

    res.status(200).send({
      data: {
        price: cryptoData.price,
        marketCap: cryptoData.marketCap,
        "24hChange": cryptoData.change,
      },
      message: "Coin stats fetched successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Error fetching stats" });
  }
};

const getDeviation = async (req, res) => {
  const { coin } = req.query;

  try {
    if(!coin) return res.status(400).send({ message: "Coin name is required" });
    
    const records = await Crypto.find({
      name: coin.toLowerCase(),
    })
      .sort({ createdAt: -1 })
      .limit(100);

    if (records.length === 0)
      return res.status(404).send({ message: "No records found" });

    const prices = records.map((record) => record.price);
    const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;
    const variance =
      prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) /
      prices.length;
    const deviation = Math.sqrt(variance);

    res
      .status(200)
      .send({
        data: { deviation },
        message: "Deviation calculated and fetched successfully",
      });
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Error calculating deviation" });
  }
};

module.exports = { getStats, getDeviation };
