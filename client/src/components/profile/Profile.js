import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Spinner } from '../layout';
import Companies from '../company/Companies';

import { getProfile } from '../../store/actions/profile';

const Profile = ({ match, getProfile, profile: { profile, loading } }) => {
  useEffect(() => {
    getProfile(match.params.handle);
  }, [getProfile]);

  if (loading && profile === null) return <Spinner />;

  return (
    <Fragment>
      {profile !== null ? (
        <Fragment>
          <h2>{profile.user.name}</h2>
          <p>{profile.description}</p>
          {loading ? null : <Companies />}
        </Fragment>
      ) : (
        <Fragment>
          <p>There is no profile with this handle</p>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfile })(Profile);
