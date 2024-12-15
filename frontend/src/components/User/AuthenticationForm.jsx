import React, { useState } from 'react';
import { registerClient, loginClient } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const AuthenticationForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    logonName: '',
    password: '',
    email: '',
    name: '',
    address: '',
    telephone_number: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const switchForm = () => {
    setIsLogin(!isLogin);
    setFormData({ logonName: '', password: '', email: '', name: '', address: '', telephone_number: '' });
    setErrors({});
    setMessage('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.logonName) newErrors.logonName = 'Login is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (!isLogin) {
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.address) newErrors.address = 'Address is required';

      if (!formData.telephone_number) {
        newErrors.telephone_number = 'Telephone number is required';
      } else if (!/^[0-9]{7,15}$/.test(formData.telephone_number)) {
        newErrors.telephone_number = 'Telephone number must be 7-15 digits long';
      }
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
      if (isLogin) {
        const credentials = {
          logon_name: formData.logonName,
          password: formData.password,
        };
        const response = await loginClient(credentials);
        localStorage.setItem('token', response.access_token);
        setMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 1000);
      } else {
        const newClient = {
          logon_name: formData.logonName,
          password: formData.password,
          email: formData.email,
          name: formData.name,
          address: formData.address,
          telephone_number: parseInt(formData.telephone_number, 10),
        };
        const response = await registerClient(newClient);
        setMessage(`Registration successful for user: ${response.logon_name}`);
        setIsLogin(true);
      }
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
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h2>
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
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          {!isLogin && (
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
          )}

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary px-4">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </div>
        </form>
        <p className="text-center mt-3">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <span className="text-primary fw-bold" role="button" onClick={switchForm}>Register here</span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span className="text-primary fw-bold" role="button" onClick={switchForm}>Login here</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthenticationForm;
