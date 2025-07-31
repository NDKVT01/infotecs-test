import { useState, useEffect } from 'react';
import './assets/App.css';
import Pagination from './Pagination.jsx';
import Table from './Table.jsx';
import Modal from './Modal.jsx';
import Filter from './Filter.jsx';

function App() {
  // State management
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [sort, setSort] = useState({ sortBy: 'none', order: 'asc' });
  const [selectedFilter, setSelectedFilter] = useState({
    key: 'firstName',
    value: ''
  });

  // Constants
  const itemsPerPage = 10;
  
  // Table column configuration
  const headers = [
    { label: 'First Name', propName: 'firstName' },
    { label: 'Maiden Name', propName: 'maidenName' },
    { label: 'Last Name', propName: 'lastName' },
    { label: 'Age', propName: 'age' },
    { label: 'Gender', propName: 'gender' },
    { label: 'Phone Number', propName: 'phone' },
    { label: 'Email', propName: 'email' },
    { label: 'Country', propName: 'address.country' },
    { label: 'City', propName: 'address.city' },
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const filterQuery = selectedFilter.value 
          ? `filter?key=${selectedFilter.key}&value=${selectedFilter.value}&` 
          : '?';
        
        const response = await fetch(
          `https://dummyjson.com/users/${filterQuery}sortBy=${sort.sortBy}&order=${sort.order}&limit=${itemsPerPage}&skip=${pageIndex * itemsPerPage}&select=id,firstName,lastName,maidenName,age,gender,address,height,weight,phone,email,image&`
        );

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status} error`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageIndex, itemsPerPage, sort, selectedFilter]);

  // Event handlers
  const handlePageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const toggleShowModal = () => {
    setShowModal(!showModal);
  };

  const toggleSorting = (attrName) => {
    if (sort.sortBy !== attrName) {
      setSort({ sortBy: attrName, order: 'asc' });
    } else if (sort.order === 'asc') {
      setSort({ ...sort, order: 'desc' });
    } else {
      setSort({ sortBy: 'none', order: 'asc' });
    }
  };

  const toggleFilter = (newFilter) => {
    setSelectedFilter(prev => ({
      ...prev,
      ...newFilter
    }));
  };

  // Loading and error states
  if (loading) return <div className='message'>Loading...</div>;
  if (error) return <div className='message'>{error}</div>;

  return (
    <div className="app-container">
      <Filter 
        headers={headers} 
        onFilterChange={toggleFilter} 
        selectedFilter={selectedFilter} 
      />
      <Table 
        data={data.users} 
        headers={headers} 
        onRowClick={handleRowClick}
        onHeaderClick={toggleSorting}
        sort={sort}
      />
      <Pagination 
        currentPage={pageIndex} 
        itemsPerPage={itemsPerPage} 
        totalItems={data.total} 
        onPageChange={handlePageChange}
      />
      <Modal 
        show={showModal} 
        onCloseButtonClick={toggleShowModal} 
        user={selectedUser}
      />
    </div>
  );
}

export default App;