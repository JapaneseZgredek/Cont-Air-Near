import React, { useState } from 'react';
import { Container, Card, Button } from "react-bootstrap";
import { fetchCurrentClient } from "../../services/api";
import UserDataUpdate from "./UserDataUpdate";

const UserPanel = () => {

    const [isToggled, setIsToggled] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [currentclient, setCurrentClient] = useState(null);
    const [error, setError] = useState(null);
    

    const handleToggle = () => {
        setIsToggled(!isToggled);
    };

    const openUpdateModal = () => {
        loadUserData();
        setShowUpdateModal(true);
    };
    const closeUpdateModal = () => {
        setShowUpdateModal(false);
    };

    const loadUserData = async () =>{
        try{
            const data = await fetchCurrentClient();
            setCurrentClient(data);
        } catch (err){
            setError('Failed to load current client data');
        }
    };

    return(
        <Container>
            <div>
                <h2>User Panel</h2>
            </div>
            <hr className="divider" /> {/*linia podzialu*/}
            {error && <p className="err-field">{"Err: "+error}</p>}
            {/*
            <Card>
                <a>Prefered display type</a>
                <label className="switch">
                    <input type="checkbox" checked={isToggled} onChange={handleToggle} />
                    <span className="slider round"></span>
                </label>
                <p>{isToggled ? "List" : "Tiles"}</p>
            </Card>
            */}

            <div className='section-buttons'>
                <p className='section-name'>User data</p>
                <Button variant="warning" className="me-2" onClick={openUpdateModal}>Update</Button>
            </div>
            <hr className="section-divider" /> {/*linia podzialu*/}


            {currentclient && (
                <UserDataUpdate
                    client={currentclient}
                    show={showUpdateModal}
                    onHide={closeUpdateModal}
                />
            )}

        </Container>
    );
};

export default UserPanel;