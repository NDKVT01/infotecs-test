import { useState, useRef, useEffect } from 'react';
import './assets/Table.css';

/**
 * A resizable and sortable table component
 * @param {Object} props - Component props
 * @param {Array} props.data - Table data
 * @param {Array} props.headers - Column configuration
 * @param {Function} props.onRowClick - Row click handler
 * @param {Function} props.onHeaderClick - Header click handler for sorting
 * @param {Object} props.sort - Current sort state
 */
const Table = ({ data, headers, onRowClick, onHeaderClick, sort }) => {
  // Column width state and refs
  const [columnWidths, setColumnWidths] = useState({});
  const tableRef = useRef(null);
  const resizingRef = useRef(null);
  const maxTableWidth = useRef(1400)
  // Size constraints
  const minWidth = 50;

  // Initialize column widths
  useEffect(() => {
    if (headers.length > 0 && Object.keys(columnWidths).length === 0) {
      const equalWidth = Math.floor(maxTableWidth.current.offsetWidth / headers.length);
      const initialWidths = headers.reduce((acc, _, index) => ({
        ...acc,
        [index]: Math.max(minWidth, equalWidth)
      }), {});
      
      setColumnWidths(initialWidths);
    }
  }, [headers]);

  /**
   * Start column resize operation
   * @param {number} columnIndex - Index of column being resized
   * @param {Event} e - Mouse event
   */
  const startResize = (columnIndex, e) => {
    e.preventDefault();
    const th = tableRef.current.querySelectorAll('th')[columnIndex];
    
    resizingRef.current = {
      columnIndex,
      startX: e.clientX,
      startWidth: th.offsetWidth,
      tableWidth: tableRef.current.offsetWidth
    };
    
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  /**
   * Handle column resize
   * @param {Event} e - Mouse event
   */
  const handleResize = (e) => {
    if (!resizingRef.current) return;
    
    const { columnIndex, startX, startWidth, tableWidth } = resizingRef.current;
    const widthChange = e.clientX - startX;
    
    // Calculate new width with constraints
    let newWidth = Math.max(minWidth, startWidth + widthChange);
    const otherColumnsWidth = tableWidth - startWidth;
    newWidth = Math.min(newWidth, maxTableWidth.current.offsetWidth - otherColumnsWidth);
    
    setColumnWidths(prev => ({
      ...prev,
      [columnIndex]: newWidth
    }));
  };

  // Clean up resize event listeners
  const stopResize = () => {
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    resizingRef.current = null;
  };

  /**
   * Render sorting indicator arrow
   * @param {string} propName - Property name being sorted
   * @returns {JSX.Element|null} Sorting arrow component
   */
  const sortingArrow = (propName) => {
    if (sort.sortBy !== propName) return null;
    return (
      <img 
        src={`src/assets/arrow_${sort.order === 'asc' ? 'up' : 'down'}.svg`}
        alt={sort.order === 'asc' ? 'Ascending' : 'Descending'}
        className="arrow"
      />
    );
  };

  // Calculate total table width
  const tableWidth = Object.values(columnWidths).reduce((sum, width) => sum + width, 0);

  return (
    <div className="table-container" ref={maxTableWidth}>
      <table 
        className="resizable-table" 
        ref={tableRef}
        style={{ width: `${Math.min(tableWidth, maxTableWidth.current.offsetWidth)}px` }}
      >
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th 
                key={index}
                style={{ width: `${columnWidths[index] || minWidth}px` }}
              >
                <div className="header-wrapper">
                  <div 
                    className={`header-content ${onHeaderClick ? 'sortable-header' : ''}`}
                    onClick={() => onHeaderClick?.(header.propName)}
                  >
                    {sortingArrow(header.propName)}
                    {header.label}
                  </div>
                  <div 
                    className="resize-handle"
                    onMouseDown={(e) => startResize(index, e)}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'clickable-row' : ''}
            >
              {headers.map((header, colIndex) => {
                // Handle nested properties (e.g., address.country)
                const value = header.propName.split('.').reduce(
                  (obj, key) => (obj && obj[key] !== undefined) ? obj[key] : '', 
                  row
                );
                
                return (
                  <td 
                    key={colIndex} 
                    style={{ width: `${columnWidths[colIndex] || minWidth}px` }}
                  >
                    <div className="cell-content" title={String(value)}>
                      {value}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;