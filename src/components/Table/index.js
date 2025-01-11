import React, { useState, useMemo } from 'react';
import './style.css';

export const Table = ({ data, columns, itemsPerPage = 5 }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = useMemo(() =>
        Math.ceil(data.length / itemsPerPage),
        [data.length, itemsPerPage]
    );

    const currentData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    }, [currentPage, data, itemsPerPage]);


    const getVisiblePageNumbers = useMemo(() => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        range.push(1);

        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
            if (i > 1 && i < totalPages) {
                range.push(i);
            }
        }

        // Always show last page
        if (totalPages > 1) {
            range.push(totalPages);
        }

        // Add the page numbers with dots
        let l = null;
        for (const i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    }, [currentPage, totalPages]);

    const handlePageChange = (pageNumber) => {
        if (typeof pageNumber === 'number') {
            setCurrentPage(pageNumber);
        }
    };

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="table-container">
            <div className="table-wrapper">
                <table className="data-table" role="table" aria-label="data-table">
                    <thead className="table-header">
                        <tr role="row">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    role="columnheader"
                                    scope="col"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item) => (
                            <tr
                                key={item['s.no']}
                                className="table-row"
                                role="row"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={`${item['s.no']}-${column.key}`}
                                        className="table-cell"
                                        role="cell"
                                    >
                                        {column.format ?
                                            column.format(item[column.key]) :
                                            item[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div
                className="pagination-container"
                role="navigation"
                aria-label="Pagination"
            >
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="pagination-button"
                    aria-label="Previous page"
                >
                    Previous
                </button>

                <div className="pagination-numbers">
                    {getVisiblePageNumbers.map((number, index) => (
                        number === '...' ? (
                            <span key={`dots-${index}`} className="pagination-dots">...</span>
                        ) : (
                            <button
                                key={number}
                                onClick={() => handlePageChange(number)}
                                className={`page-number ${currentPage === number ? 'active' : ''}`}
                                aria-label={`Page ${number}`}
                                aria-current={currentPage === number ? 'page' : undefined}
                            >
                                {number}
                            </button>
                        )
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                    aria-label="Next page"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Table;