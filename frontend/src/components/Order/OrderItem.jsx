import React, { useState, useContext } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteOrder } from '../../services/api';
import OrderUpdate from './OrderUpdate';
import Order_productButton from "../Order_product/Order_productButton";
import GenericDetailModal from "../GenericDetailModal";
import '../../styles/List.css';
import { RoleContext } from '../../contexts/RoleContext';

const OrderItem = ({ order, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [displayType, setDisplayType] = useState("straight");
    const { role } = useContext(RoleContext);    

    const handleDelete = async () => {
        try {
            await deleteOrder(order.id_order);
            onDelete(order.id_order);
            setShowConfirm(false);
        } catch (error) {
            console.error('Failed to delete order:', error);
        }
    };

    const openUpdateModal = () => {
        setShowUpdateModal(true);
    };

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
    };

    return (
        <>
            <Card className={`${displayType}-item-card`}>
                    <Card.Title
                        className="clickable"
                        onClick={() => setShowDetailModal(true)}
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Order ID: {order.id_order}
                    </Card.Title>

                    {/* Kontener dla tekstów */}
                    <div className="item-texts">
                        <a>Status: {order.status}</a>
                        <a>Description: {order.description}</a>
                        <a>Port ID: {order.id_port}</a>
                        <a>Client ID: {order.id_client}</a>
                    </div>

                    {/* Kontener dla przycisków */}
                    <div className="item-buttons">
                        <Order_productButton orderId={order.id_order}/>
                        {(['EMPLOYEE', 'ADMIN'].includes(role)) && (
                            <>
                            <Button variant="warning" className="me-2" onClick={openUpdateModal}>Update</Button>
                            <Button variant="danger" onClick={() => setShowConfirm(true)}>Delete</Button>
                            </>
                        )}
                    </div>
            </Card>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this order?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
                </Modal.Footer>
            </Modal>

            <GenericDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                title={`Order: ${order.id_order}`}
                details={order}
            />


            <OrderUpdate
                order={order}
                show={showUpdateModal}
                onHide={closeUpdateModal}
                onUpdate={onUpdate}
            />
        </>
    );
};

export default OrderItem;
