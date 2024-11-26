import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseurl } from './BaseUrl';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const userinformation = async () => {
        setName('');
        setEmail('');
        setPassword('');

        const status = true;
        try {
            let response = await fetch(`${baseurl}register`, {
                method: 'POST',
                body: JSON.stringify({ name, email, password, status }),
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            let result = await response.json();
            
            if (result.message) {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div 
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }} // Light background
        >
            <div className="p-5 shadow rounded" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#ffffff' }}>
                <h1 className='text-center mb-4' style={{ color: '#007bff' }}>Sign Up</h1>
                
                <div className="mb-3">
                    <input 
                        type="text" 
                        className="form-control" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Enter your name"
                        style={{ padding: '10px', fontSize: '1rem' }}
                    />
                </div>

                <div className="mb-3">
                    <input 
                        type="email" 
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

                <div className="d-grid">
                    <button 
                        type="button" 
                        onClick={userinformation} 
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

export default Register;
