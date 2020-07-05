import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Spinner } from '../layout';
import DashboardActions from './DashboardActions';

import { getCurrentProfile } from '../../store/actions/profile';

const Dashboard = ({
  match,
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  if (loading && profile === null) return <Spinner />;

  return (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <p>{profile.description}</p>
          <DashboardActions />
          <Link to="/companies" className="btn btn-primary my-1">
            My Companies
          </Link>
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup a profile. You can add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1  ">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.authentication,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
