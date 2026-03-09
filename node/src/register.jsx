import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const navigate = useNavigate();

    const validateForm = () => {
        if (!email || !password || !name) {
            setError('Please enter all fields.');
            return false;
        }

        setError('');
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const body = JSON.stringify({ name, email, password });

        try {
            const response = await fetch('http://127.0.0.1/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            setLoading(false);

            if (response.ok) {
                const data = await response.json();
               
                alert('User registered.');

                setTimeout(() => {
                    navigate('/');
                }, 1000);

            } else {
                setError(errorData.detail || 'Service not available. Try later');
            }
        } catch (error) {
            setLoading(false);
            setError('An error occurred. Please try again.');
        }
    };

    const goToLogin = () => {
        navigate('/login');
    };
    
    return (
        <div style={{ backgroundColor: '#eeeeee', color:"#333333" }}>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label>Email:</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label>Password:</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Register'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <a href="#" onClick={(e) => { e.preventDefault(); goToLogin(); }} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>Already have an account? Login here</a>
        </div>
    );

}

export default Login;