import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateToken, logout } from './http/client';

function Users() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await validateToken();
            } catch (error) {
                navigate('/');
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();

        verifyToken();

    }, [navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
};


    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f0f0f0' }}>
                <h1>Users</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <ul style={{ flex: 1, overflow: 'auto' }}>
                {users.map((user) => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Users;