import React, { useState } from 'react';
import { SearchIcon } from '@heroicons/react/solid';



// Dummy stock market data
const dummyData = [
  { ticker: 'AAPL', price: 150.45, volume: 5000, sector: 'Technology' },
  { ticker: 'TSLA', price: 850.22, volume: 3200, sector: 'Automotive' },
  { ticker: 'AMZN', price: 3200.18, volume: 2000, sector: 'E-Commerce' },
  { ticker: 'MSFT', price: 280.35, volume: 4000, sector: 'Technology' },
  { ticker: 'GOOGL', price: 2750.12, volume: 1500, sector: 'Technology' },
];

function AssetList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState({ column: '', direction: 'asc' });
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const sortData = (data) => {
    if (sort.column) {
      return data.sort((a, b) => {
        const sortValue =
          a[sort.column] > b[sort.column] ? 1 : a[sort.column] < b[sort.column] ? -1 : 0;
        return sort.direction === 'asc' ? sortValue : -sortValue;
      });
    }
    return data;
  };

  const filteredData = sortData(
    dummyData
      .filter(
        (data) =>
          data.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.sector.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((data) => {
        if (selectedSectors.length === 0) return true;
        return selectedSectors.includes(data.sector);
      })
      .filter((data) => {
        if (minPrice !== '' && data.price < minPrice) return false;
        if (maxPrice !== '' && data.price > maxPrice) return false;
        return true;
      })
  );

  const handleSortColumnChange = (e) => {
    const selectedColumn = e.target.value;
    setSort({ column: selectedColumn, direction: 'asc' });
  };

  const handleSortDirectionChange = (e) => {
    setSort({ ...sort, direction: e.target.value });
  };

  const handleSectorChange = (e) => {
    const value = e.target.value;
    setSelectedSectors((prevSectors) =>
      prevSectors.includes(value)
        ? prevSectors.filter((sector) => sector !== value)
        : [...prevSectors, value]
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-4xl font-extrabold mb-6 text-gray-800 text-center">Asset List</h2>

      {/* Search input */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by ticker or sector"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-md p-3 pl-10 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      </div>

      {/* Filter Container */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full sm:max-w-2xl mb-6">
        {/* Multi-filter: Filter by sector */}
        <fieldset className="mb-6">
          <legend className="font-semibold text-gray-700">Filter by Sector</legend>
          <div className="flex flex-wrap justify-center gap-4">
            {['Technology', 'Automotive', 'E-Commerce'].map((sector) => (
              <label className="flex items-center" key={sector}>
                <input
                  type="checkbox"
                  value={sector}
                  onChange={handleSectorChange}
                  checked={selectedSectors.includes(sector)}
                  className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">{sector}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Filter by price */}
        <fieldset className="mb-6">
          <legend className="font-semibold text-gray-700">Filter by Price</legend>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <label className="flex flex-col w-full sm:w-1/2">
              Min Price:
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="flex flex-col w-full sm:w-1/2">
              Max Price:
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
        </fieldset>

        {/* Sorting Dropdowns for columns and direction in the same line */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <select
            onChange={handleSortColumnChange}
            value={sort.column}
            className="w-full sm:max-w-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sort by</option>
            <option value="ticker">Ticker</option>
            <option value="price">Price</option>
            <option value="volume">Volume</option> {/* Added sort by volume */}
            <option value="sector">Sector</option>
          </select>

          <select
            onChange={handleSortDirectionChange}
            value={sort.direction}
            className="w-full sm:max-w-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Table with sorted and filtered data */}
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="border-collapse border border-gray-300 w-full mb-4 bg-white shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border border-gray-300 p-4 text-left">Ticker</th>
              <th className="border border-gray-300 p-4 text-left">Price</th>
              <th className="border border-gray-300 p-4 text-left">Volume</th>
              <th className="border border-gray-300 p-4 text-left">Sector</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data, index) => (
                <tr key={index} className="hover:bg-gray-100 transition duration-200">
                  <td className="border border-gray-300 p-4">{data.ticker}</td>
                  <td className="border border-gray-300 p-4">{data.price.toFixed(2)}</td>
                  <td className="border border-gray-300 p-4">{data.volume}</td>
                  <td className="border border-gray-300 p-4">{data.sector}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center border border-gray-300 p-4">
                  No matching data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssetList;
