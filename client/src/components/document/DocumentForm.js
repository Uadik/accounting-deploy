import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createDocument } from '../../store/actions/documents';

const DocumentForm = ({ createDocument, companyId }) => {
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
    createDocument(formData, companyId);
  };

  return (
    <Fragment>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Document name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter an document name"
            value={name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Save Document
          </button>
        </div>
      </form>
    </Fragment>
  );
};

DocumentForm.propTypes = {
  createDocument: PropTypes.func.isRequired,
};

export default connect(null, { createDocument })(DocumentForm);
