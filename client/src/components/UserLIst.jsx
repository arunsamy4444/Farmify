import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/admin/getallusers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="users-wrapper">
      <h2 className="title">Users List</h2>

      {loading && (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user._id} className="user-card">
              <img
                src={`http://localhost:5000${user.profilePic}`}
                alt={user.name}
                className="user-avatar"
              />
              <div className="user-info">
                <p className="user-name">{user.name}</p>
                <p className="user-email">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
<style>{`
  .users-wrapper {
    max-width: 700px;
    margin: 60px auto;
    padding: 30px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    animation: fadeIn 0.4s ease-in-out;
  }

  .title {
    font-size: 26px;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 24px;
    text-align: center;
  }

  .user-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .user-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: #f9fafb;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: transform 0.2s ease;
  }

  .user-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  }

  .user-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid #ccc;
    object-fit: cover;
  }

  .user-info {
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
  }

  .user-email {
    font-size: 14px;
    color: #6b7280;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 600px) {
    .users-wrapper {
      margin: 30px 16px;
      padding: 20px;
    }

    .user-card {
      flex-direction: column;
      align-items: flex-start;
    }

    .user-avatar {
      width: 54px;
      height: 54px;
    }
  }
`}</style>

     
    </div>
  );
};

export default UsersList;

