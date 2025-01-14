import React, { useState } from 'react';
import '../styles/styling.css';
import { useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));
    const err = Validation(values);
    setErrors(err);

    if (Object.keys(err).length === 0) {
      axios
        .post('http://localhost:8085/login', values)
        .then((res) => {
          if (res.data.message === 'Success') {
            navigate('/home');
          } else {
            alert('Invalid credentials');
          }
        })
        .catch((err) => {
          console.error('Axios Error:', err.response ? err.response.data : err.message);
          alert('An error occurred. Please check your credentials and try again.');
        });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h1 className="heading">LOG IN</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={handleInput}
            />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              onChange={handleInput}
            />
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>
          <button type="submit" className="btn btn-success w-100">
            Login
          </button>
          <p>
            If we don't have an account? <a href="signup">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
