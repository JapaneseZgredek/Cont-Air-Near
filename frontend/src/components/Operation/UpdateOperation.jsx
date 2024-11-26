import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { updateOperation } from '../../services/api';
import { fetchShips } from '../../services/api';
import { fetchPorts } from '../../services/api';

const UpdateOperation = ({ operation, show, onHide, onUpdate }) => {
  const [nameOfOperation, setNameOfOperation] = useState(operation.name_of_operation);
  const [operationType, setOperationType] = useState(operation.operation_type);
  const [dateOfOperation, setDateOfOperation] = useState(operation.date_of_operation);
  const [idShip, setIdShip] = useState(operation.id_ship);
  const [idPort, setIdPort] = useState(operation.id_port);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('handleSubmit wywolane');
    const updatedOperation = {
      ...operation,
      name_of_operation: nameOfOperation,
      operation_type: operationType,
      date_of_operation: dateOfOperation,
      id_ship: idShip,
      id_port: idPort
    };

    try {
      const result = await updateOperation(updatedOperation);
      onUpdate(result);
      onHide();
    } catch (error) {
      console.error('Failed to update operation:', error);
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
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Operation</Modal.Title>
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
            <Form.Control
              as="select"
              value={operationType}
              onChange={(e) => setOperationType(e.target.value)}
            >
              <option value="at_bay">At Bay</option>
              <option value="transport">Transport</option>
              <option value="transfer">Transfer</option>
              <option value="departure">Departure</option>
              <option value="arrival">Arrival</option>
              <option value="loading">Cargo Loading</option>
              <option value="discharge">Cargo Discharge</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date of Operation</Form.Label>
            <Form.Control
              type="datetime-local"
              value={dateOfOperation}
              onChange={(e) => setDateOfOperation(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
              <Form.Label>Ship</Form.Label>
              <Form.Control 
              as="select"
              required
              value={idShip}
              onChange={(e) => setIdShip(e.target.value)}
              placeholder="Select ship">
                  <option value="">Select Ship</option>
            {
            	ships.map((ship) => (
            		<option key={ship.id_ship} value={ship.id_ship}>{ship.name}</option>
            	))
            }
              </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
              <Form.Label>Port</Form.Label>
              <Form.Control
              as="select"
              required
              value={idPort}
              onChange={(e) => setIdPort(e.target.value)}
              placeholder="Select port">
                  <option value="">Select Port</option>
              {
              	ports.map((port) => (
              		<option key={port.id_port} value={port.id_port}>{port.name}</option>
              	))
              }
              </Form.Control>
          </Form.Group>
          
          <Button variant="success" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateOperation;
