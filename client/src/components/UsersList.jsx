import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/UsersList.css';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/getallusers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getImageUrl = (profilePic) => {
    if (!profilePic) return '/default-avatar.png';
    
    // Handle all possible URL formats
    if (profilePic.startsWith('http')) {
        return profilePic; // Already full URL
    }
    
    if (profilePic.startsWith('/uploads')) {
        return `${process.env.REACT_APP_BASE_URL}${profilePic}`; // /uploads/filename.jpg
    }
    
    return `${process.env.REACT_APP_BASE_URL}/uploads/${profilePic}`; // Just filename
  };

  if (loading) return <div className="users-list-loading">Loading users...</div>;
  if (error) return <div className="users-list-error">{error}</div>;

  return (
    <div className="users-list-container">
      <h2 className="users-list-title">Users List</h2>
      
      {users.length === 0 ? (
        <div className="users-list-empty">
          No users found
        </div>
      ) : (
        <div className="users-list">
          {users.map((user) => (
            <div key={user._id} className="users-list-card">
              <div className="users-list-avatar-container">
                <img
                  src={getImageUrl(user.profilePic)}
                  alt={user.name}
                  className="users-list-avatar"
                  onError={(e) => {
                    console.log('Failed to load profile picture:', user.profilePic);
                    e.target.src = '/default-avatar.png';
                  }}
                />
              </div>
              <div className="users-list-info">
                <h3 className="users-list-name">{user.name || 'Unknown User'}</h3>
                <p className="users-list-email">{user.email || 'No email'}</p>
                <div className="users-list-meta">
                  <span className={`users-list-role users-list-role-${user.role?.toLowerCase() || 'user'}`}>
                    {user.role || 'User'}
                  </span>
                  <span className="users-list-date">
                    Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersList;