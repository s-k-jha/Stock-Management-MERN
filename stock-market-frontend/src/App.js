// src/App.js
import React, { useState, useEffect } from "react";
import {BrowserRouter as Router, Routes, Route, NavLink, } from "react-router-dom";
import "./App.css";

const Stocks = ({ addToWatchlist }) => {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        // Fetch stock data from the backend
        fetch("http://localhost:5000/api/stocks")
            .then((res) => res.json())
            .then((data) => setStocks(data))
            .catch((error) => console.error("Error fetching stocks:", error));
    }, []);
    console.log(stocks, "Stocksdata");

    const getRandomColor = () => {
        const colors = ["#FF0000", "#00FF00"]; // Red and Green
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div className="App">
            <h1>Stock Management Management App</h1>
            <h2>Stocks</h2>
            <ul>
                {stocks.map((stock) => (
                    // <li key={stock.symbol}> 
                    //i have changed this to remove console errors
                    <li key={stock._id || `${stock.symbol}-${stock.company}`}>
                        {stock.company} ({stock.symbol}) -
                        <span style={{ color: getRandomColor() }}>
                            {" "}
                            ${stock.initial_price}
                        </span>
                        <button onClick={() => addToWatchlist(stock)}>
                            Add to My Watchlist
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Watchlist = ({ watchlist , removeFromWatchlist }) => {
    const getRandomColor = () => {
        const colors = ["#FF0000", "#00FF00"]; // Red and Green
        return colors[Math.floor(Math.random() * colors.length)];
    };
    

    return (
        <div className="App">
            <h1>Stock Management MERN App</h1>
            <h2>My Watchlist</h2>
            <ul>
                {watchlist.map((stock) => (
                    // <li key={stock.symbol}>
                    <li key={stock._id || `${stock.symbol}-${stock.company}`}>
                        {stock.company} ({stock.symbol}) -
                        <span style={{ color: getRandomColor() }}>
                            {" "}
                            ${stock.initial_price}
                        </span>
                        <button onClick={() => removeFromWatchlist(stock)}>
                            Remove from Watchlist
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

function App() {
    const [watchlist, setWatchlist] = useState([]);

    const addToWatchlist = (stock) => {
        // Add stock to watchlist
        fetch("http://localhost:5000/api/watchlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(stock),
        })
            .then((res) => res.json())
            .then((data) => {
                // Show an alert with the message received from the server
                alert(data.message);
                setWatchlist([...watchlist, stock]);
            })
            .catch((error) =>
                console.error("Error adding to watchlist:", error)
            );
    };

     // Function to remove stock from the watchlist
     const removeFromWatchlist = (stock) => {
        fetch(`http://localhost:5000/api/watchlist/${stock._id}`,{
            method: "DELETE", 
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                // Remove stock from local state after successful deletion
                setWatchlist(watchlist.filter((s) => s._id !== stock._id));
            })
            .catch((error) =>
                console.error("Error removing from watchlist:", error)
            );
    };

    return (
        <Router>
            <nav>
                <NavLink to="/stocks">Stocks</NavLink>
                <NavLink to="/watchlist">Watchlist</NavLink>
                
            </nav>
            <Routes>
                <Route
                    path="/stocks"
                    element={<Stocks addToWatchlist={addToWatchlist} />}
                />
                
                <Route
                path="/watchlist"
                element={<Watchlist watchlist={watchlist} removeFromWatchlist={removeFromWatchlist} />} // removeFromWatchlist is used here
            />
            </Routes>
        </Router>
    );
}

export default App;
