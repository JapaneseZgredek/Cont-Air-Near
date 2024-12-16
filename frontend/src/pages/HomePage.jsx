import React from 'react';
// import Navbar from '../components/Navbar/Navbar';
// to dubluje navbar przez to jak jest obslugiwany w app.jsx
import AuthenticationForm from "../components/User/AuthenticationForm";
//tutaj tez tego nie uzyjemy
// to tez dubluje navbar przez to jak jest obslugiwany w app.jsx

import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
    const token = localStorage.getItem('token');

    return (
        <div>
            {/*<Navbar />*/}
            <div className="d-flex flex-column justify-content-center align-items-center mt-5">
                <h1 className="display-1 text-primary fw-bold text-center">
                    Welcome to Cont-Air-Near!
                </h1>
                {token ? (
                    <p>Enjoy access to all operations and management tools!</p>
                ) : (
                    <p>Log in to manage your logistics efficiently.</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;
