import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../store/actions/auth';

const LoginForm = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    login(email, password);
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={email}
            onChange={handleChange}
            required
            className={
              'form-control' + (submitted && !email ? ' is-invalid' : '')
            }
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            required
            className={
              'form-control' + (submitted && !password ? ' is-invalid' : '')
            }
          />
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            {/* {registering && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )} */}
            Log In
          </button>
        </div>
      </form>
      <p>
        Do not have an account? <Link to="/register">Sign In!</Link>
      </p>
    </Fragment>
  );
};

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.authentication.isAuthenticated,
});

export default connect(mapStateToProps, { login })(LoginForm);
