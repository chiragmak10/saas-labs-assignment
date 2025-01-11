import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Table } from '.';
import { mockData } from './mockdata'
describe('Table Component', () => {
    const mockColumns = [
        { key: 's.no', header: 'S.No.' },
        { key: 'percentage.funded', header: 'Percentage Funded', format: (value) => `${value}%` },
        { key: 'amt.pledged', header: 'Amount Pledged', format: (value) => `$${value}` },
    ];
    describe('Rendering', () => {

        test('renders correct number of rows per page', () => {
            render(<Table data={mockData} columns={mockColumns} itemsPerPage={3} />);

            const rows = screen.getAllByRole('row');
            // +1 for header row
            expect(rows).toHaveLength(4);
        });

        test('renders formatted data correctly', () => {
            render(<Table data={mockData} columns={mockColumns} itemsPerPage={3} />);

            expect(screen.getByText('80%')).toBeInTheDocument();
            expect(screen.getByText('$1000')).toBeInTheDocument();
        });
    });

    describe('pagination', () => {
        test('renders correct number of page buttons', () => {
            render(<Table data={mockData} columns={mockColumns} itemsPerPage={2} />);
            const pageButtons = screen.getAllByRole('button').filter(button =>
                /^Page \d+$/.test(button.getAttribute('aria-label') || '')
            );
            expect(pageButtons).toHaveLength(3);
        });

        test('previous button is disabled on first page', () => {
            render(<Table data={mockData} columns={mockColumns} />);
            const prevButton = screen.getByRole('button', { name: /previous/i });
            expect(prevButton).toBeDisabled();
        });

        test('next button is disabled on last page', () => {
            render(<Table data={mockData} columns={mockColumns} itemsPerPage={3} />);
            const nextButton = screen.getByRole('button', { name: /next/i });
            fireEvent.click(nextButton);
            expect(nextButton).toBeDisabled();
        });

        test('changes page when page number is clicked', () => {
            render(<Table data={mockData} columns={mockColumns} itemsPerPage={2} />);
            const pageButton = screen.getByRole('button', { name: 'Page 2' });
            fireEvent.click(pageButton);
            expect(screen.getByText('$3000')).toBeInTheDocument();
        });
    });

    // Navigation Tests
    describe('Navigation', () => {
        test('next button shows next page of data', () => {
            render(<Table data={mockData} columns={mockColumns} itemsPerPage={2} />);

            const nextButton = screen.getByRole('button', { name: /next/i });
            fireEvent.click(nextButton);

            expect(screen.getByText('$3000')).toBeInTheDocument();
            expect(screen.queryByText('$1000')).not.toBeInTheDocument();
        });

        test('previous button shows previous page of data', () => {
            render(<Table data={mockData} columns={mockColumns} itemsPerPage={2} />);

            const nextButton = screen.getByRole('button', { name: /next/i });
            fireEvent.click(nextButton);

            const prevButton = screen.getByRole('button', { name: /previous/i });
            fireEvent.click(prevButton);

            expect(screen.getByText('$1000')).toBeInTheDocument();
            expect(screen.queryByText('$3000')).not.toBeInTheDocument();
        });
    });
    describe('Edge Cases', () => {
        test('handles empty data array', () => {
            render(<Table data={[]} columns={mockColumns} />);
            const rows = screen.queryAllByRole('row');
            expect(rows).toHaveLength(1);
        });

        test('handles single page of data', () => {
            render(<Table data={mockData.slice(0, 2)} columns={mockColumns} itemsPerPage={5} />);

            const pageButtons = screen.getAllByRole('button').filter(button =>
                /^Page \d+$/.test(button.getAttribute('aria-label') || '')
            );
            expect(pageButtons).toHaveLength(1);
        });
    });
    describe('Accessibility', () => {
        test('table has appropriate ARIA labels', () => {
            render(<Table data={mockData} columns={mockColumns} />);

            expect(screen.getByRole('table')).toHaveAttribute('aria-label', 'data-table');
            expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Pagination');
        });

        test('current page is marked with aria-current', () => {
            render(<Table data={mockData} columns={mockColumns} itemsPerPage={2} />);
            const currentPage = screen.getByRole('button', { name: 'Page 1' });
            expect(currentPage).toHaveAttribute('aria-current', 'page');
        });
    });
});