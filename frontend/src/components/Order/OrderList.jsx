import React, { useEffect, useState } from 'react';
import OrderItem from './OrderItem';
import OrderAdd from './OrderAdd';
import { fetchOrders } from '../../services/api';
import { Container } from 'react-bootstrap';
import SearchAndFilterBar from '../SearchAndFilterBar';
import '../../styles/List.css';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchInColumn, setSearchInColumn] = useState('');
    const [error, setError] = useState(null);
    const [displayType, setDisplayType] = useState("straight");

    const loadOrders = async () => {
        try {
            const data = await fetchOrders();
            setOrders(data);
            setFilteredOrders(data);
        } catch (err) {
            setError('Failed to load orders');
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setFilteredOrders(orders);
        } else if (searchInColumn) {
            const filtered = orders.filter(order =>
                order[searchInColumn] && order[searchInColumn].toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredOrders(filtered);
        } else {
            const filtered = orders.filter(order =>
                Object.values(order).some(value =>
                    value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredOrders(filtered);
        }
    };

    const handleSearchInChange = (column) => {
        setSearchInColumn(column);
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Orders</h2>
                <OrderAdd onAdd={(newOrder) => setOrders(prev => [...prev, newOrder])} />
            </div>
            <hr className="divider" /> {/*linia podzialu*/}


            <SearchAndFilterBar
                onSearch={handleSearch}
                onSearchInChange={handleSearchInChange}
                onSortChange={() => {}}
                filterOptions={['id_order', 'status', 'id_port']}
            />

            {error && <p className="err-field">{"Err: "+error}</p>}
            <div className={`${displayType}-list`}>
            {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                    <OrderItem
                        key={order.id_order}
                        order={order}
                        onDelete={(id) => setOrders(prev => prev.filter(o => o.id_order !== id))}
                        onUpdate={(updatedOrder) =>
                            setOrders(prev => prev.map(o => o.id_order === updatedOrder.id_order ? updatedOrder : o))
                        }
                    />
                ))
            ) : (
                <p>No orders available.</p>
            )}
            </div>
        </Container>
    );
};

export default OrderList;
