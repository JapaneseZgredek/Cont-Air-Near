import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteProduct , fetchProductImage } from '../../services/api';
import UpdateProduct from "./UpdateProduct";
import Order_productButton from "../Order_product/Order_productButton";
import GenericDetailModal from "../GenericDetailModal";
import '../../styles/List.css';
import { RoleContext } from '../../contexts/RoleContext';

const ProductItem = ({product, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [loadingImage, setLoadingImage] = useState(true);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [displayType, setDisplayType] = useState("grid");
    const { role } = useContext(RoleContext);

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
        loadImage();
    };

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

    useEffect(() => {
        loadImage();
    }, [product.id_product]);


    return(
        <>
            <Card className={`${displayType}-item-card`}>
                    <Card.Title
                            className="clickable"
                            onClick={() => setShowDetailModal(true)}
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {product.name}
                        </Card.Title>
                    {/* Kontener dla tekstów */}
                    <div className="item-texts">
                        <a>Price: {product.price}</a>
                        <a>Weight: {product.weight}</a>
                        <a>Port ID: {product.id_port}</a>
                    </div>

                    {/* Obrazek */}
                    <div>
                        {loadingImage ? (
                            <div className="loading-message">Loading image...</div>
                        ) : imageUrl ? (
                            <img 
                                className="item-image" 
                                src={imageUrl} 
                                alt={`Product_${product.id_product}`} 
                            />
                        ) : (
                            <div className="missing-image">Missing image</div>
                        )}
                    </div>

                    {/* Kontener dla przycisków */}
                    <div className="item-buttons">
                        {(['EMPLOYEE','ADMIN'].includes(role)) && (<>
                        <Order_productButton productId={product.id_product} productName={product.name} />
                        <Button variant="warning" onClick={openUpdateModal}>Update</Button>
                        <Button variant="danger" onClick={() => setShowConfirm(true)}>Delete</Button>
                        </>)}
                    </div>
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

            <GenericDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                title={`Product: ${product.name}`}
                details={product}
            />

            <UpdateProduct
                product={product}
                show={showUpdateModal}
                onHide={closeUpdateModal}
                onUpdate={onUpdate}
            />
        </>
    );
};

export default ProductItem;
