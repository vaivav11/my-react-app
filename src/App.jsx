import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isButtonShown, setIsButtonShown] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const fetchData = () => {
    setLoading(true);
    const url = `https://hiring-api.simbuka.workers.dev/?page=${currentPage}&size=${pageSize}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const totalCount = res.headers.get('X-Total-Count');
        setTotalUsers(parseInt(totalCount, 10) || 0);
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
    const totalPages = Math.ceil(totalUsers / pageSize);
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    setPageSize(size);
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
                <th>First Name</th>
                <th>Last Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>
                    <button onClick={() => handleClick(user)}>
                      More information
                    </button>
                    {selectedUser && selectedUser.id === user.id && (
                      <div className={isButtonShown ? 'show' : ''}>
                        <button onClick={() => handleClick(user)}>X</button>
                        <p>Identification Number: {user.customerIdentificationCode}</p>
                        <p>First Name: {user.firstName}</p>
                        <p>Last Name: {user.lastName}</p>
                        <p>Birth Date: {user.birthDate}</p>
                        <p>Gender: {user.gender}</p>
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
              disabled={currentPage >= Math.ceil(totalUsers / pageSize)}
            >
              Next
            </button>
            <div>
              <label htmlFor="pageSize">Users per page:</label>
              <select id="pageSize" value={pageSize} onChange={handlePageSizeChange}>
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
