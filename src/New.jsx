// TableComponent.js
import './NewStyle.css'
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TableComponent = ({ data, columns }) => {
  const [columnOrder, setColumnOrder] = useState(columns.map((col) => col.key));
  const [columnWidths, setColumnWidths] = useState(
    columns.reduce((acc, col) => {
      acc[col.key] = 150; // Set initial width for each column
      return acc;
    }, {})
  );
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilter = (key, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  const handleColumnOrderChange = (newOrder) => {
    setColumnOrder(newOrder);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
  };

  const handleResize = (key, newWidth) => {
    setColumnWidths((prevWidths) => ({ ...prevWidths, [key]: newWidth }));
  };

  const filteredAndSortedData = data
    .filter((item) =>
      Object.keys(filters).every((key) =>
        item[key] ? item[key].toString().toLowerCase().includes(filters[key].toLowerCase()) : true
      )
    )
    .filter((item) =>
      Object.values(item).some(
        (value) => value && value.toString().toLowerCase().includes(searchTerm)
      )
    )
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const key = sortConfig.key;
      const aValue = a[key];
      const bValue = b[key];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const startIdx = (currentPage - 1) * pageSize;
  const paginatedData = filteredAndSortedData.slice(startIdx, startIdx + pageSize);

  const handleMouseDown = (e, key) => {
    const initialX = e.clientX;
    const initialWidth = columnWidths[key];

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - initialX;
      const newWidth = initialWidth + deltaX;

      if (newWidth > 50) {
        // Minimum width to prevent columns from collapsing
        handleResize(key, newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search Table" className='search'
        />
      </div>
      <table>
        <thead>
          <tr>
            {columnOrder.map((colKey) => (
              <th
                key={colKey}
                style={{ width: columnWidths[colKey] }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  {columns.find((col) => col.key === colKey).title}
                  <button className='sort' onClick={() => handleSort(colKey)}>Sort</button>
                  <input
                    type="text"
                    value={filters[colKey] || ''}
                    onChange={(e) => handleFilter(colKey, e.target.value)}
                    placeholder={`Filter ${columns.find((col) => col.key === colKey).title}`}
                  />
                  <div
                    style={{
                      width: '10px',
                      height: '100%',
                      background: '#ddd',
                      position: 'absolute',
                      right: '0',
                      top: '0',
                      cursor: 'ew-resize',
                    }}
                    onMouseDown={(e) => handleMouseDown(e, colKey)}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={index}>
              {columnOrder.map((colKey) => (
                <td key={colKey}>{row[colKey]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button  className='btn' disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
          Previous
        </button>
        <span>{`Page ${currentPage} of ${Math.ceil(filteredAndSortedData.length / pageSize)}`}</span>
        <button
          disabled={currentPage === Math.ceil(filteredAndSortedData.length / pageSize)}
          onClick={() => handlePageChange(currentPage + 1)} className='btn'
        >
          Next
        </button>
      </div>
    </div>
  );
};

TableComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const usersData = [
  { id: 1, name: 'John David', age: 23, city: 'New York' },
  { id: 2, name: 'poorvika', age: 37, city: 'inida' },
  { id: 3, name: 'Bobby', age: 28, city: 'bangalore' },
  { id: 4, name: 'Ajay', age: 35, city: 'bihar' },
  { id: 5, name: 'Charlie', age: 22, city: 'mysore' },
  { id: 6, name: 'ankit', age: 29, city: 'durga' },
  { id: 7, name: 'anand', age: 73, city: 'Denver' },
  { id: 8, name: 'Miller', age: 17, city: 'Seattle' },
  { id: 9, name: 'Girish', age: 34, city: 'asia' },
  { id: 10, name: 'Harry potter', age: 16, city: 'davangere' },
];

const columns = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: 'Name' },
  { key: 'age', title: 'Age' },
  { key: 'city', title: 'City' },
];

const TableTask = () => {
  return (
    <div>
      <h3 className='heading'>User Table</h3>
      <TableComponent data={usersData} columns={columns} />
    </div>
  );
};

export default TableTask;
