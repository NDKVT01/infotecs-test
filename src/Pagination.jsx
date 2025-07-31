import './assets/Pagination.css';

/**
 * Pagination controls component
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current page index (0-based)
 * @param {number} props.itemsPerPage - Number of items per page
 * @param {number} props.totalItems - Total number of items
 * @param {Function} props.onPageChange - Page change handler
 */
const Pagination = ({ currentPage, itemsPerPage, totalItems, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="pagination" aria-label="Table pagination">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        aria-label="Previous page"
      >
        Previous
      </button>
      
      {/* Current page indicator (1-based) */}
      <span aria-live="polite">
        Page {currentPage + 1} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage + 1 >= totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;