import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setAlert } from '../../store/actions/alert';
import { register } from '../../store/actions/auth';

const RegisterForm = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const { username, email, password, password2 } = formData;

  const [submitted, setSubmitted] = useState(false);
  // const registering = useSelector((state) => state.registration.registering);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (password !== password2) {
      setAlert('Passwords mismatch', 'danger');
    } else {
      register(username, email, password);
    }
    // dispatch(userActions.register(formData));
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={username}
            onChange={handleChange}
            // required
            className={
              'form-control' + (submitted && !username ? ' is-invalid' : '')
            }
          />
        </div>

        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={email}
            onChange={handleChange}
            // required
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
            // minLength="6"
            className={
              'form-control' + (submitted && !password ? ' is-invalid' : '')
            }
          />
        </div>

        <div className="form-group">
          <label>Repeat your password</label>
          <input
            type="password"
            name="password2"
            placeholder="Password"
            value={password2}
            onChange={handleChange}
            // minLength="6"
            className={
              'form-control' +
              (submitted && password !== password2 ? ' is-invalid' : '')
            }
          />
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            {/* {registering && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )} */}
            Register
          </button>
        </div>
      </form>
      <p>
        Already have an accoint? <Link to="/login">Sign In!</Link>
      </p>
    </Fragment>
  );
};

RegisterForm.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.authentication.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(RegisterForm);
