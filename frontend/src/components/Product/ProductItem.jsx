import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteProduct , fetchProductImage } from '../../services/api';
import UpdateProduct from "./UpdateProduct";
import Order_productButton from "../Order_product/Order_productButton";

const ProductItem = ({product, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [loadingImage, setLoadingImage] = useState(true);

    const handleDelete = async () => {
        try{
            await deleteProduct(product.id_product);
            onDelete(product.id_product);
            setShowConfirm(false);
        } catch (error) {
            console.error('Failed to delete product: ', error);
        }
    };

    const openUpdateModal = () => {
        setShowUpdateModal(true);
    };

    const closeUpdateModal = () =>{
        setShowUpdateModal(false);
    };

  useEffect(() => {
    const loadImage = async () => {
      try {
            setLoadingImage(true);
            const url = await fetchProductImage(product.id_product);
            setImageUrl(url);
        } catch (error) {
            console.error("Failed to load product image", error);
            setImageUrl(null);
        } finally {
            setLoadingImage(false);
        }
    };

    loadImage();
    }, [product.id_product]);


    return(
        <>
            <Card className="mb-3">
                <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>Price: {product.price}</Card.Text>
                        <Card.Text>Weight: {product.weight}</Card.Text>
                        {/*<Card.Text>Port ID: {product.id_port}</Card.Text>*/}
                    </div>
                    <div>
                        {loadingImage ? (
                            <div>Loading image...</div>
                        ) : imageUrl ? (
                            <img 
                                src={imageUrl} 
                                alt={`Product_${product.id_product}`} 
                                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }} 
                                //TODO replace inline style by creating CSS
                                />
                        ) : (
                            <div>Missing image</div>
                        )}
                    </div>
                    <div>
                        <Button variant="warning" className="me-2" onClick={openUpdateModal}>Update</Button>
                        <Button variant="danger" onClick={() => setShowConfirm(true)}>Delete</Button>
                        <Order_productButton productId={product.id_product} productName={product.name}/>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this product? There is no going back
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
                </Modal.Footer>
            </Modal>

            <UpdateProduct
                product={product}
                show={showUpdateModal}
                onHide={closeUpdateModal}
                onUpdate={onUpdate}
            />
        </>
    )
};

export default ProductItem;