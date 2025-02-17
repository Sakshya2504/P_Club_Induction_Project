import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import './App.css'


const CryptoPriceTracker = () => {
  const [searchTerm, setSearchTerm] = useState(null);
  const [currency, setCurrency] = useState("USDT");
  const [price, setPrice] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cryptoMap = {
    bitcoin: "BTC",
    ethereum: "ETH",
    dogecoin: "DOGE",
    "binance coin": "BNB",
    cardano: "ADA",
    xrp: "XRP",
    solana: "SOL",
    polygon: "MATIC",
    polkadot: "DOT",
    litecoin: "LTC",
    chainlink: "LINK",
    stellar: "XLM",
    "bitcoin cash": "BCH",
    tron: "TRX",
  };

  const fiatCurrencies = ["USDT", "BUSD", "USD", "EUR", "INR", "GBP", "JPY", "AUD", "CAD"];

  const fetchPrice = async () => {
    setLoading(true);
    setError(null);

    try {
      const search = searchTerm.trim().toLowerCase();
      const cryptoSymbol = cryptoMap[search] || search.toUpperCase();

      if (!cryptoSymbol) throw new Error("Invalid cryptocurrency.");

      const binanceSymbol = `${cryptoSymbol}${currency}`;

      const priceRes = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}`
      );
      const priceData = await priceRes.json();

      if (!priceData.price) {
        throw new Error("Invalid cryptocurrency or currency pair.");
      }

      setPrice(parseFloat(priceData.price).toFixed(2));

      const histRes = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=1d&limit=30`
      );
      const histData = await histRes.json();

      setHistoricalData(
        histData.map((entry) => ({
          date: new Date(entry[0]).toLocaleDateString(),
          price: parseFloat(entry[4]),
        }))
      );
    } catch (err) {
      setError("OOPS Something Went Wrong!");
      setPrice(null);
      setHistoricalData([]);
    }

    setLoading(false);
  };

  return (
    <div className="body">
      <div className="heading">
        <h2>Crypto Price Tracker</h2>

        <div className="input">
          <label>Search Cryptocurrency (Name or Symbol):</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter Your CryptoCurrency Here!"
          />

        </div>


        <div className="info_2">
          <label>Select Currency:</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {fiatCurrencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>

        </div>

        <div className="button">
          <button onClick={fetchPrice} disabled={loading}>
            {loading ? "Loading..." : "Get Price"}
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <h3>
          {price ? `${searchTerm.toUpperCase()} / ${currency} = ${currency} ${price}` : "Welcome to the World of Crypto!"}
        </h3>
        <div className="graph">
          {historicalData.length > 0 && (
            <Line
              data={{
                labels: historicalData.map((d) => d.date),
                datasets: [
                  {
                    label: `${searchTerm.toUpperCase()} Price in ${currency}`,
                    data: historicalData.map((d) => d.price),
                    borderColor: "rgb(1, 1, 22)",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                scales: {
                  x: {
                    ticks: {
                      color: "#021325", // X-axis labels color
                    },
                  },
                  y: {
                    ticks: {
                      color: "#021325", // Y-axis labels color
                    },
                  },
                },
              }}
            />
          )}
        </div>

      </div>
      <div className="info">
        <h3>Abbreviations:</h3>
        USDT – Tether (USD Tether) <br />
        BUSD – Binance USD <br />
        USD – United States Dollar <br />
        EUR – Euro <br />
        INR – Indian Rupee <br />
        GBP – British Pound Sterling <br />
        JPY – Japanese Yen <br />
        AUD – Australian Dollar <br />
        CAD – Canadian Dollar <br />
      </div>
    </div>
  );

};


export default CryptoPriceTracker;
