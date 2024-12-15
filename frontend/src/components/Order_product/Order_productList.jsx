import React, { useEffect, useState } from 'react';
import Order_productItem from './Order_productItem';
import Order_productAdd from './Order_productAdd';
import { fetchOrders_products } from '../../services/api';
import { Container } from 'react-bootstrap';
import '../../styles/List.css';

const Order_productList = () => {
    const [order_products, setOrder_products] = useState([]);
    const [error, setError] = useState(null);
    const [displayType, setDisplayType] = useState("straight");

    const loadOrder_products = async () => {
        try {
            const data = await fetchOrders_products();
            setOrder_products(data);
        } catch (err) {
            setError('Failed to load order_products');
        }
    };

    useEffect(() => {
        loadOrder_products();
    }, []);

    const handleAddOrder_product = (newOrder_product) => {
        setOrder_products((prevOrder_products) => [...prevOrder_products, newOrder_product]);
    };

    const handleUpdateOrder_product = (updatedOrder_product) => {
        setOrder_products((prevOrder_products) =>
            prevOrder_products.map((order_product) =>
                (order_product.id_order === updatedOrder_product.id_order
                    && order_product.id_product === updatedOrder_product.id_product
                ) ? updatedOrder_product : order_product
            )
        );
    };

    const handleDeleteOrder_product = (id_order, id_product) => {
        setOrder_products((prevOrder_products) => prevOrder_products
        .filter((order_product) => order_product.id_order !== id_order)
        .filter((order_product) => order_product.id_product !== id_product));
    };
    
    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Order_product List</h2>
                <Order_productAdd onAdd={handleAddOrder_product} />
            </div>
            <hr className="divider" /> {/*linia podzialu*/}

            {error && <p className="err-field">{"Err: "+error}</p>}
            <div className={`${displayType}-list`}>
            {order_products.length > 0 ? (
                order_products.map((order_product) => (
                    <Order_productItem
                        key={order_product.id_order}
                        order_product={order_product}
                        onDelete={handleDeleteOrder_product}
                        onUpdate={handleUpdateOrder_product}
                    />
                ))
            ) : (
                <p>No order_products available.</p>
            )}
            </div>
        </Container>
    );
};

export default Order_productList;
