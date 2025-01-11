import React, { useState, useEffect } from "react";
import "./App.css";
import { Table } from "./components/Table";
function App() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        fetch(
            "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json"
        )
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => console.error("Error fetching data:", error)).finally(() => {
                setIsLoading(false)
            });
    }, []);

    const columns = [
        { key: "s.no", header: "S.No." },
        {
            key: "percentage.funded",
            header: "Percentage Funded",
            format: (value) => `${value}`,
        },
        {
            key: "amt.pledged",
            header: "Amount Pledged",
            format: (value) => `${value.toLocaleString()}`,
        },
    ];
    return isLoading ? <div>Loading...</div> : <Table data={data} columns={columns} itemsPerPage={5} />;
}

export default App;
