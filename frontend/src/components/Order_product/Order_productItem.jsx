import React, { useEffect, useState, useContext } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteOrder_product } from '../../services/api';
import { fetchProducts } from '../../services/api';
import Order_productUpdate from './Order_productUpdate';
import '../../styles/List.css';
import { RoleContext } from '../../contexts/RoleContext';

const Order_productItem = ({ order_product, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [displayType, setDisplayType] = useState("straight");
    const { role } = useContext(RoleContext);    

    // Fetch products to resolve product names
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (err) {
                console.error('Failed to load products:', err);
                setError('Failed to load products.');
            }
        };
        loadProducts();
    }, []);

    // Delete handler
    const handleDelete = async () => {
        try {
            await deleteOrder_product(order_product.id_order, order_product.id_product);
            onDelete(order_product.id_order, order_product.id_product);
            setShowConfirm(false);
        } catch (err) {
            console.error('Failed to delete order_product:', err);
            setError('Failed to delete order_product.');
        }
    };

    // Resolve product name
    const getProductName = (idProduct) => {
        const product = products.find((p) => p.id_product === idProduct);
        return product ? product.name : 'Unknown Product';
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
                    <Card.Title>
                        Order ID: {order_product.id_order} 
                    </Card.Title>
                    <Card.Title>
                        Product: {getProductName(order_product.id_product)}
                    </Card.Title>

                    {/* Display Quantity */}
                    <div className="item-texts">
                        <p><strong>Quantity:</strong> {order_product.quantity}</p> {/* Displaying the quantity */}
                    </div>

                    {/* Kontener dla przycisków */}
                    {(['ADMIN'].includes(role)) && (
                    <div className="item-buttons">
                        <Button variant="warning" className="me-2" onClick={openUpdateModal}>Update</Button>
                        <Button variant="danger" onClick={() => setShowConfirm(true)}>Delete</Button>
                    </div>
                    )}
            </Card>

            {/* Confirmation Modal for Deletion */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this order_product?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Update Modal */}
            <Order_productUpdate
                order_product={order_product}
                show={showUpdateModal}
                onHide={() => setShowUpdateModal(false)}
                onUpdate={onUpdate}
            />
        </>
    );
};

export default Order_productItem;
