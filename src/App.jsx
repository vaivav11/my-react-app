import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isButtonShown, setIsButtonShown] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const fetchData = () => {
    setLoading(true);
    const url = `https://jsonplaceholder.typicode.com/users?_page=${currentPage}&_limit=${pageSize}`;

    fetch(url)
      .then((res) => {
        const totalCount = res.headers.get('X-Total-Count');
        setTotalUsers(totalCount || 0);
        return res.json();
      })
      .then((users) => {
        setData(users);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleClick = (user) => {
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(null);
      setIsButtonShown(false);
    } else {
      setSelectedUser(user);
      setIsButtonShown(true);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table id="users">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => handleClick(user)}>
                      More information
                    </button>
                    {selectedUser && selectedUser.id === user.id && (
                      <div className={isButtonShown ? 'show' : ''}>
                        <button onClick={() => handleClick(user)}>X</button>
                        <p>Street: {user.address.street}</p>
                        <p>Suite: {user.address.suite}</p>
                        <p>City: {user.address.city}</p>
                        <p>Zipcode: {user.address.zipcode}</p>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={data.length === 0 || data.length < pageSize || (currentPage * pageSize) >= totalUsers}
            >
              Next
            </button>
            <div>
              <label htmlFor="pageSize">Users per page:</label>
              <select id="pageSize" value={pageSize} onChange={handlePageSizeChange}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
