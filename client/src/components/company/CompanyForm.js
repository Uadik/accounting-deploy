import React, { useState, useEffect, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createCompany, getCompany } from '../../store/actions/company';

const CompanyForm = ({
  company: { company, loading },
  createCompany,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
  });

  const history = useHistory();

  // useEffect(() => {
  //   if (isEdit) {
  //     getCurrentProfile();
  //     setFormData({
  //       handle: loading || !profile.handle ? '' : profile.handle,
  //       description: loading || !profile.description ? '' : profile.description,
  //     });
  //   }
  // }, [loading]);

  const { name, description, isPublic } = formData;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const checkBoxHandler = (event) => {
    const { name, checked } = event.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    createCompany(formData, history, isEdit);
  };

  return (
    <Fragment>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Company name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter a company name"
            value={name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Company description</label>
          <textarea
            name="description"
            placeholder="Enter a company description"
            value={description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            className="m-1"
            type="checkbox"
            name="isPublic"
            placeholder="Enter a company description"
            defaultChecked={isPublic}
            onChange={checkBoxHandler}
          />
          <label>
            Make this company public? (You can change this option at any time)
          </label>
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Update Company' : 'Save Company'}
          </button>
        </div>
      </form>
    </Fragment>
  );
};

CompanyForm.propTypes = {
  createCompany: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  isEdit: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  company: state.company,
});

export default connect(mapStateToProps, { createCompany })(CompanyForm);
