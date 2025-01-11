import React, { useState, useEffect } from "react";
import { Table } from "./components/Table";
function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(
            "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json"
        )
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => console.error("Error fetching data:", error))
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
    return <Table data={data} columns={columns} itemsPerPage={5} />;
}

export default App;
