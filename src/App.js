import React, { useState, useEffect } from "react";
import { Table } from "./components/Table";
import "./App.css";

const App = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(
            "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json"
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (!Array.isArray(data)) {
                    throw new Error("Invalid data format received");
                }
                setData(data);
                setError(null);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const columns = [
        {
            key: "s.no",
            header: "S.No.",
        },
        {
            key: "percentage.funded",
            header: "Percentage Funded",
            format: (value) => `${value}%`,
        },
        {
            key: "amt.pledged",
            header: "Amount Pledged",
            format: (value) => `$${value.toLocaleString()}`,
        },
    ];

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-content">
                    <h1>Kickstarter Projects Dashboard</h1>
                    <p className="subtitle">
                        Overview of project funding status and pledged amounts
                    </p>
                </div>
            </header>

            {error && (
                <div className="error-banner">
                    <span className="error-icon">⚠️</span>
                    <div className="error-content">
                        <h4>Error</h4>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            <main className="main-content">
                {loading ? (
                    <div className="loading-container">
                        <div className="loader"></div>
                        <p>Loading data...</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <Table
                            data={data}
                            columns={columns}
                            itemsPerPage={5}
                            style={{ minHeight: 300 }}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
