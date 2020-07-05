import React, { Fragment, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import Spinner from '../layout/spinner/Spinner';
import { getProfiles } from '../../store/actions/profile';

const Profiles = ({ getProfiles, profiles, loading }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);
  const history = useHistory();

  if (loading) return <Spinner />;

  return (
    <Fragment>
      {!profiles.length ? 'There is no profiles' : null}
      {profiles.map((profile, index) => {
        return (
          <div
            key={index}
            className={index % 2 === 0 ? 'background-blue' : 'background-white'}
          >
            <h2
              className="pointer"
              onClick={() => {
                history.push(`/profile/${profile.handle}`);
              }}
            >
              {profile.user.name}
            </h2>
            <p>Profile created at {moment(profile.date).format('MMMM YYYY')}</p>
          </div>
        );
      })}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profiles: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  profiles: state.profile.profiles,
  loading: state.profile.loading,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
