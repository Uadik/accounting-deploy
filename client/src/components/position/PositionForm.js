import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createPosition } from '../../store/actions/positions';

const PositionForm = ({ createPosition, companyId, parentId }) => {
  const [formData, setFormData] = useState({
    title: '',
  });

  const { title } = formData;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    createPosition(formData, companyId, parentId);
  };

  return (
    <Fragment>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Position title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter an position title"
            value={title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Save Position
          </button>
        </div>
      </form>
    </Fragment>
  );
};

PositionForm.propTypes = {
  createPosition: PropTypes.func.isRequired,
};

export default connect(null, { createPosition })(PositionForm);
