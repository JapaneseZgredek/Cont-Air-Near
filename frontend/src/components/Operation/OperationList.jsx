import React, { useEffect, useState } from 'react';
import OperationItem from './OperationItem';
import AddOperation from './AddOperation';
import { fetchOperations } from '../../services/api';
import { Container } from 'react-bootstrap';

const OperationList = () => {
    const [operations, setOperations] = useState([]);
    const [error, setError] = useState(null);

    const loadOperations = async () => {
        try {
            const data = await fetchOperations();
            setOperations(data);
        } catch (err) {
            setError('Failed to load operations');
        }
    };

    useEffect(() => {
        loadOperations();
    }, []);

    const handleAddOperation = (newOperation) => {
        setOperations((prevOperations) => [...prevOperations, newOperation]);
    };

    const handleUpdateOperation = (updatedOperation) => {
        setOperations((prevOperations) =>
            prevOperations.map((operation) =>
                operation.id_operation === updatedOperation.id_operation ? updatedOperation : operation
            )
        );
    };

    const handleDeleteOperation = (id) => {
        setOperations((prevOperations) => prevOperations.filter((operation) => operation.id_operation !== id));
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Operation List</h2>
                <AddOperation onAdd={handleAddOperation} />
            </div>
            {error ? (
                  <p style={{ color: 'red' }}>{error}</p>
                ) : operations.length > 0 ? (
                  operations.map((operation) => (
                    <OperationItem
                      key={operation.id_operation}
                      operation={operation}
                      onDelete={handleDeleteOperation}
                      onUpdate={handleUpdateOperation}
                    />
                  ))
                ) : (
                  <p>No operations available.</p>
                )}
        </Container>
    );
};

export default OperationList;