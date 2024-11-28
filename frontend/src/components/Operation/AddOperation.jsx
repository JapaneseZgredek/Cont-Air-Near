import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createOperation } from "../../services/api"; //
import { fetchShips } from '../../services/api';
import { fetchPorts } from '../../services/api';

const AddOperation = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [nameOfOperation, setNameOfOperation] = useState('');
    const [operationType, setOperationType] = useState('at_bay');
    const [dateOfOperation, setDateOfOperation] = useState('');
    const [idShip, setIdShip] = useState('');
    const [idPort, setIdPort] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const newOperation = await createOperation({
          name_of_operation: nameOfOperation,
          operation_type: operationType.toLowerCase(),
          date_of_operation: dateOfOperation || new Date().toISOString(),
          id_ship: parseInt(idShip),
          id_port: parseInt(idPort),
        });
        console.log('Operation created:', newOperation); // Debugging log
        onAdd(newOperation);
        setShow(false);
      } catch (err) {
        console.error('Failed to create operation:', err.message); // Debugging log
        setError('Failed to create operation');
      }
    };

    //for ships/ports dropdown list
    const [ships, setShips] = useState([]);
    const [ports, setPorts] = useState([]);
    const loadShips = async () => {
        try {
            const data = await fetchShips();
            setShips(data);
        } catch (err) {
            setError('Failed to load ships');
        }
    };
    const loadPorts = async () => {
        try {
            const data = await fetchPorts();
            setPorts(data);
        } catch (err) {
            setError('Failed to load ports');
        }
    };
    useEffect(() => {
        loadShips();
        loadPorts();
    }, []);

    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>Add Operation</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Operation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Operation Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={nameOfOperation}
                                onChange={(e) => setNameOfOperation(e.target.value)}
                                placeholder="Enter operation name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Operation Type</Form.Label>
                                <Form.Select
                                  value={operationType}
                                  onChange={(e) => setOperationType(e.target.value)}
                                >
                                  <option value="AT_BAY">At Bay</option>
                                  <option value="TRANSPORT">Transport</option>
                                  <option value="TRANSFER">Transfer</option>
                                  <option value="DEPARTURE">Departure</option>
                                  <option value="ARRIVAL">Arrival</option>
                                  <option value="loading">Cargo Loading</option>
                                  <option value="discharge">Cargo Discharge</option>
                                </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Date of Operation</Form.Label>
                          <Form.Control
                            type="datetime-local"
                            value={dateOfOperation || new Date().toISOString().slice(0, 16)}
                            onChange={(e) => setDateOfOperation(e.target.value)}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Ship</Form.Label>
                          <Form.Select
                            value={idShip}
                            onChange={(e) => setIdShip(e.target.value)}
                          >
                            <option value="">Select Ship</option>
                            {ships.map((ship) => (
                              <option key={ship.id_ship} value={ship.id_ship}>
                                {ship.name || `Ship ${ship.id_ship}`}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Port</Form.Label>
                          <Form.Select
                            value={idPort}
                            onChange={(e) => setIdPort(e.target.value)}
                          >
                            <option value="">Select Port</option>
                            {ports.map((port) => (
                              <option key={port.id_port} value={port.id_port}>
                                {port.name || `Port ${port.id_port}`}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>

                        <Button variant="success" type="submit">Add Operation</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddOperation;