import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, validateToken } from './service/auth';
import { getJoke } from './service/joke';

function Joke() {
    const navigate = useNavigate();

    const [joke, setJoke] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            setLoading(true);

            try {
                await validateToken();

            } catch (error) {
                navigate('/');

            } finally {
                setLoading(false);
            }
        };

        const fetchUsers = async () => {
            setLoading(true);

            try {
                const joke = await getJoke();

                setJoke(joke);

            } catch (error) {
                console.error('Error fetching joke:', error);

            } finally {
                setLoading(false);
            }
        };

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

    const getRandomJoke = async () => {
        setLoading(true);

        try {
            const joke = await getJoke();

            setJoke(joke.value);

        } catch (error) {
            console.error('Error fetching joke:', error);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: '#333333', color: 'white' }}>
                <a href="/users" style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}>Users</a>
                <a href="/joke" style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}>Joke</a>
            </nav>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f0f0f0', maxHeight: '200px', color: "#333333" }}>
                <h1>Users</h1>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>Logout</a>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem', backgroundColor: '#f0f0f0', maxHeight: '200px', color: "#333333" }}>
                {loading ? <p>Loading...</p> : <p>{joke}</p>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem', backgroundColor: '#f0f0f0', maxHeight: '200px', color: "#333333" }}>
                <button type="button" onClick={() => getRandomJoke()} style={{ cursor: 'pointer', padding: '0.5rem 1rem', marginRight: '0.5rem' }}>Cuenta un chiste</button>
            </div>
        </div>
    );
}

export default Joke;