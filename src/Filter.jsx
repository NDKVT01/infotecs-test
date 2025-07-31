import './assets/Filter.css';

/**
 * Filter controls component
 * @param {Object} props - Component props
 * @param {Array} props.headers - Available filter options
 * @param {Function} props.onFilterChange - Filter change handler
 * @param {Object} props.selectedFilter - Current filter selection
 */
const Filter = ({ headers, onFilterChange, selectedFilter }) => {
  /**
   * Handle filter property change
   * @param {Event} e - Change event
   */
  const handlePropertyChange = (e) => {
    onFilterChange({ key: e.target.value });
  };

  /**
   * Handle filter value change
   * @param {Event} e - Change event
   */
  const handleValueChange = (e) => {
    onFilterChange({ value: e.target.value });
  };

  return (
    <div className="filter" aria-label="Data filter">
      <label>
        Filter by:
        {/* Filter property selection dropdown */}
        <select 
          onChange={handlePropertyChange}
          value={selectedFilter.key}
          aria-label="Filter by property"
        >
          {headers.map((header) => (
            <option 
              key={header.propName} 
              value={header.propName}
            >
              {header.label}
            </option>
          ))}
        </select>
        
        {/* Filter value input */}
        <input 
          type='text' 
          placeholder='Enter filter text...' 
          onChange={handleValueChange}
          value={selectedFilter.value}
          aria-label="Filter text"
        />
      </label>
    </div>
  );
};

export default Filter;