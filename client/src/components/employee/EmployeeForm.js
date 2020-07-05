import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createEmployee } from '../../store/actions/employees';

const EmployeeForm = ({ createEmployee, companyId }) => {
  const [formData, setFormData] = useState({
    name: '',
  });

  const { name } = formData;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    createEmployee(formData, companyId);
  };

  return (
    <Fragment>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Employee name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter an employee name"
            value={name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Save Employee
          </button>
        </div>
      </form>
    </Fragment>
  );
};

EmployeeForm.propTypes = {
  createEmployee: PropTypes.func.isRequired,
};

export default connect(null, { createEmployee })(EmployeeForm);
