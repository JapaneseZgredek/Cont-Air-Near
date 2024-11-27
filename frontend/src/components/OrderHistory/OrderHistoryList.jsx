import React, { useEffect, useState } from 'react';
import OrderHistoryItem from './OrderHistoryItem';
import OrderHistoryAdd from './OrderHistoryAdd';
import { fetchOrderHistories } from '../../services/api';
import { Container } from 'react-bootstrap';

const OrderHistoryList = () => {
    const [histories, setHistories] = useState([]);
    const [error, setError] = useState(null);

    const loadHistories = async () => {
        try {
            const data = await fetchOrderHistories();
            setHistories(data);
        } catch (err) {
            setError('Failed to load order histories');
        }
    };

    useEffect(() => {
        loadHistories();
    }, []);

    const handleAddHistory = (newHistory) => {
        setHistories((prev) => [...prev, newHistory]);
    };

    const handleUpdateHistory = (updatedHistory) => {
        setHistories((prev) =>
            prev.map((history) =>
                history.id_history === updatedHistory.id_history ? updatedHistory : history
            )
        );
    };

    const handleDeleteHistory = (id) => {
        setHistories((prev) => prev.filter((history) => history.id_history !== id));
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Order Histories</h2>
                <OrderHistoryAdd onAdd={handleAddHistory} />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {histories.length > 0 ? (
                histories.map((history) => (
                    <OrderHistoryItem
                        key={history.id_history}
                        history={history}
                        onUpdate={handleUpdateHistory}
                        onDelete={handleDeleteHistory}
                    />
                ))
            ) : (
                <p>No order histories available.</p>
            )}
        </Container>
    );
};

export default OrderHistoryList;
