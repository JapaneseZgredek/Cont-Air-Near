import React, { useState } from 'react';
import { registerUser, loginUser } from '../../services/api';

const emailRegex = /\S+@\S+\.\S+/;

function AuthenticationForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ logonName: '', password: '', email: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const switchForm = () => {
    setIsLogin(!isLogin);
    setFormData({ logonName: '', password: '', email: '' });
    setErrors({});
    setMessage('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.logonName) newErrors.logonName = 'Login is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!isLogin && !formData.email) newErrors.email = 'Email is required';
    else if (!isLogin && !emailRegex.test(formData.email)) newErrors.email = 'Enter a valid email, please';
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
                logonName: formData.logonName,
                password: formData.password,
            };
            const response = await loginUser(credentials);
            setMessage(`Welcome! Token: ${response.access_token}`);
        } else {
            const newUser = {
                logon_name: formData.logonName,
                password: formData.password,
                email: formData.email,
            };
            const response = await registerUser(newUser);
            setMessage(`Registration successful for user: ${response.logon_name}`);
        }
        setErrors({});
    } catch (err) {
        setMessage(err.message);
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
            <label htmlFor="logonName" className="form-label">
              User Login:
            </label>
            <input type="text" className={`form-control ${errors.logonName ? 'is-invalid' : ''}`} id="logonName"
              name="logonName"
              placeholder="Login"
              value={formData.logonName}
              onChange={handleChange}
            />
            {errors.logonName && <div className="invalid-feedback">{errors.logonName}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
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
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          )}
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary px-4">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </div>
        </form>
        <p className="text-center mt-3">
            {isLogin ? (<>Don't have an account?{' '}<span className="text-primary fw-bold" role="button" onClick={switchForm}>Register here</span></>):(<>Already have an account?{' '}
              <span className="text-primary fw-bold"
                role="button"
                onClick={switchForm}>
                Login here
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default AuthenticationForm;
