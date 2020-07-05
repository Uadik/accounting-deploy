import React, { useState, useEffect, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createProfile, getCurrentProfile } from '../../store/actions/profile';

const CreateProfile = ({
  profile: { profile, loading },
  createProfile,
  getCurrentProfile,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    handle: '',
    description: '',
  });

  useEffect(() => {
    if (isEdit) {
      getCurrentProfile();
      setFormData({
        handle: loading || !profile.handle ? '' : profile.handle,
        description: loading || !profile.description ? '' : profile.description,
      });
    }
  }, [loading]);

  const history = useHistory();

  const { handle, description } = formData;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    createProfile(formData, history, isEdit);
  };

  return (
    <Fragment>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Profile handle</label>
          <input
            type="text"
            name="handle"
            placeholder="Enter a profile handle"
            value={handle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Profile description</label>
          <textarea
            name="description"
            placeholder="Enter a profile description"
            value={description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Update Profile' : 'Edit Profile'}
          </button>
          <Link to="/dashboard" className="btn btn-light my-1">
            Go Back
          </Link>
        </div>
      </form>
    </Fragment>
  );
};

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object,
  isEdit: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  CreateProfile
);
