import React, { useEffect } from 'react';
import AuthenticationForm from '../components/User/AuthenticationForm';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) navigate('/'); // Redirect to home if already logged in
    }, [navigate]);

    return (
        <div className='form-page'>
            <AuthenticationForm />
        </div>
    );
};

export default LoginPage;
