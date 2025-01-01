import React, { useState, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { updateUserOwnData } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '../../contexts/RoleContext';
import '../../styles/panel.css';

const UserDataUpdate = ({client, show, onHide}) => {
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        logonName: client.logon_name,
        password: "",
        email: client.email,
        name: client.name,
        address: client.address,
        telephone_number: client.telephone_number
    });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [keepPassword, setKeepPassword] = useState(true);
    const { handleLogout } = useContext(RoleContext);

    const handleLoginSuccess = async () => {
        try {
          if(formData.logonName !== 
            client.logon_name || 
            formData.email !== 
            client.email || 
            !keepPassword){
            handleLogout();
            navigate('/');
          }
          onHide();
        } catch (error) {
          console.error('Data update failed:', error.message);
        }
      };


    const validateForm = () => {
        const newErrors = {};
    
        // Regular Expressions
        const loginRegex = /^[a-zA-Z0-9]{4,}$/;
        const passwordRegex = /^.{8,}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
        const nameRegex = /^[a-zA-Z ]{3,}$/;
        const telephoneNumberRegex = /^[0-9]{7,15}$/;
        const addressRegex = /^[a-zA-Z0-9 .\-\/]{8,64}$/;
    
        // Login Name
        if (!formData.logonName) {
          newErrors.logonName = 'Login is required.';
        } else if (!loginRegex.test(formData.logonName)) {
          newErrors.logonName = 'Login must be at least 4 characters long and alphanumeric.';
        }
    
        // Password
        if (!keepPassword && !formData.password) {
            newErrors.password = 'Password is required.';
          } else if (!keepPassword && formData.password && !passwordRegex.test(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters long.';
          }
        
        // Email
        if (!formData.email) {
          newErrors.email = 'Email is required.';
        } else if (!emailRegex.test(formData.email)) {
          newErrors.email = 'Email must be a valid format (e.g., mail@domain.com).';
        }

        // Name
        if (!formData.name) {
          newErrors.name = 'Name is required.';
        } else if (!nameRegex.test(formData.name)) {
          newErrors.name = 'Name must be at least 3 letters long.';
        }

        // Address
        if (!formData.address) {
          newErrors.address = 'Address is required.';
        } else if (!addressRegex.test(formData.address)) {
          newErrors.address = 'Address must be at least 8-64 characters long.';
        }

        // Telephone
        if (!formData.telephone_number) {
          newErrors.telephone_number = 'Telephone number is required.';
        } else if (!telephoneNumberRegex.test(formData.telephone_number)) {
          newErrors.telephone_number = 'Telephone number must be 7-15 digits long.';
        }
        
        return newErrors;
    };

        const handleSubmit = async (e) => {
            e.preventDefault();
            const newErrors = validateForm();
            if (Object.keys(newErrors).length > 0) {
              setErrors(newErrors);
              return;
            }
                    
        
            try {
                const updatedClient = {
                    ...client,
                    logon_name: formData.logonName !== client.logonName ? formData.logonName : null,
                    password: keepPassword ? "" : formData.password,
                    email: formData.email !== client.email ? formData.email : null,
                    name: formData.name !== client.name ? formData.name : null,
                    address: formData.address !== client.address ? formData.address : null,
                    telephone_number: formData.telephone_number !== client.telephone_number ?
                     parseInt(formData.telephone_number, 10) : null,
                };
                const response = await updateUserOwnData(updatedClient);
                setMessage(`Data update successful for user: ${response.logon_name}`);
                handleLoginSuccess();
              
              setErrors({});
            } catch (err) {
              setMessage(err.message || 'Something went wrong!');
            }
          };
        
          const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
            setErrors({ ...errors, [e.target.name]: '' });
          };
    

      return (
        <Modal show={show} onHide={onHide} centered>
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4">{'Update user data'}</h2>
            {message && <div className="alert alert-info text-center">{message}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="logonName" className="form-label">Login Name:</label>
                <input
                  type="text"
                  className={`form-control ${errors.logonName ? 'is-invalid' : ''}`}
                  id="logonName"
                  name="logonName"
                  placeholder="Login"
                  value={formData.logonName}
                  onChange={handleChange}
                />
                {errors.logonName && <div className="invalid-feedback">{errors.logonName}</div>}
              </div>
    
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password:</label>
                {!keepPassword && (
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                )}
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}

                {!keepPassword && (
                  <div className="form-check mt-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="showPassword"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    <label className="form-check-label" htmlFor="showPassword">
                      Show Password
                    </label>
                  </div>
                )}

                <div className="form-check mt-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="keepPassword"
                    checked={keepPassword}
                    onChange={() => setKeepPassword(!keepPassword)}
                  />
                  <label className="form-check-label" htmlFor="keepPassword">
                    Keep the old password
                  </label>
                </div>
            </div>
    
              
                <>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
    
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
    
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      id="address"
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>
    
                  <div className="mb-3">
                    <label htmlFor="telephone_number" className="form-label">Telephone Number:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.telephone_number ? 'is-invalid' : ''}`}
                      id="telephone_number"
                      name="telephone_number"
                      placeholder="Telephone Number"
                      value={formData.telephone_number}
                      onChange={handleChange}
                    />
                    {errors.telephone_number && <div className="invalid-feedback">{errors.telephone_number}</div>}
                  </div>
                </>
              
                {(formData.logonName !== 
                client.logon_name || 
                formData.email !== 
                client.email || 
                !keepPassword) && (
                  <label className="alert alert-warning mt-3" role="alert">
                    Warning: Submitting the current changes will require you to log in again.
                  </label>
                )}

              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary px-4">
                  {'Submit changes'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      );
};

export default UserDataUpdate;
