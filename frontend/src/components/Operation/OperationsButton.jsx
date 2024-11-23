import React, { useState } from 'react';
import {Button, Modal, ModalBody, Spinner, Table} from 'react-bootstrap';
import { fetchOperationsByPort } from "../../services/api";

function OperationsButton({ portId, portName }) {
    const [operations, setOperations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const openModal = async () => {
        setLoading(true);
        try {
            const operationData = await fetchOperationsByPort(portId);
            setOperations(operationData);
        } catch (error) {
            console.error('Failed to fetch operations:', error);
        } finally {
            setLoading(false);
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setOperations([]);
    }

    return (
        <>
            <Button variant="info" onClick={openModal} style={{ marginRight: "10px" }}>
                Show Operations
            </Button>

            <Modal show={showModal} onHide={closeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Operations for Port {portName}</Modal.Title>
                </Modal.Header>
                <ModalBody>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" />
                        </div>
                    ) : operations.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Operation Name</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                            {operations.map((op, index) =>
                                <tr key={op.id_operation}>
                                    <td>{index + 1}</td>
                                    <td>{op.name_of_operation}</td>
                                    <td>{op.operation_type}</td>
                                    <td>{new Date(op.date_of_operation).toLocaleString()}</td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No operations found for this port.</p>
                    )}
                </ModalBody>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default OperationsButton;