import React, { useState } from "react";
import { baseurl } from "./BaseUrl";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const logininformation = async () => {
        setEmail('');
        setPassword('');

        try {
            const response = await fetch(`${baseurl}login`, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (result.user) {
                sessionStorage.setItem('user', JSON.stringify(result.user));
                navigate('/chat');
            } else {
                alert('Invalid email or password');
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}
        >
            <div className="p-5 shadow rounded" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#ffffff' }}>
                <h1 className="text-center mb-4" style={{ color: '#007bff' }}>Login Page</h1>

                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        style={{ padding: '10px', fontSize: '1rem' }}
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        style={{ padding: '10px', fontSize: '1rem' }}
                    />
                </div>

                <div className="mb-3 text-center">
                    <Link to="/register" style={{ textDecoration: 'none', color: '#007bff' }}>
                        Don’t have an account? Sign up here
                    </Link>
                </div>

                <div className="d-grid">
                    <button
                        type="button"
                        onClick={logininformation}
                        className="btn btn-primary btn-lg"
                        style={{ fontWeight: 'bold', padding: '10px' }}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login;
