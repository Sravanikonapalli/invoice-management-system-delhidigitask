import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/styling.css';
import Validation from './LoginValidation';
import axios from 'axios';

const Signup = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));
    const err = Validation(values);
    setErrors(err);
    if (!err.name && !err.email && !err.password) {
      axios
        .post('http://localhost:8085/signup', values)
        .then(() => {
          navigate('/');
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h1 className="heading">SIGN UP</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 ">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              name="name"
              onChange={handleInput}
            />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>
          <div className="mb-3 ">
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
          <button type="submit" className="btn btn-success w-100 mb-3">
            Sign Up
          </button>
          <p>Already have an account? Please login</p>
          <Link to="/">
            <button type="button" className="login-btn">
              Log In
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;
