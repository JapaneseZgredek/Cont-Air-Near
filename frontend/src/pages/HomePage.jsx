import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import AuthenticationForm from "../components/User/AuthenticationForm";

import 'bootstrap/dist/css/bootstrap.min.css';


function HomePage() {
    return (
        <div>
            <Navbar/>
            <div className="d-flex flex-column justify-content-center align-items-center mt-5">
                <h1 className="display-1 text-primary fw-bold text-center">
                    Welcome to the Homepage!
                </h1>
                {/*<img src="/image.png" alt="Cont-air-near logo" className="img-fluid mt-4"/>*/}
            </div>
                <AuthenticationForm/>

            {/*  */}
        </div>);
}

export default HomePage;