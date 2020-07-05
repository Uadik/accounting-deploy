import React, { Fragment, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Switch } from 'react-router-dom';

import { getCompany } from '../../store/actions/company';

import Employees from '../employee/Employees';
import Documents from '../document/Documents';
import Positions from '../position/Positions';
import { Spinner } from '../layout';
import PrivateRoute from '../routing/PrivateRoute';

const Company = ({ match, company: { firm, firmLoading }, getCompany }) => {
  useEffect(() => {
    getCompany(match.params.id);
  }, [getCompany]);

  const history = useHistory();

  if (firmLoading) return <Spinner />;

  return (
    <Fragment>
      <button
        onClick={() => {
          history.goBack();
        }}
        className="btn btn-light my-1"
      >
        Go Back
      </button>

      <h1 className="large text-primary">{firm ? firm.name : ''}</h1>
      <p>{firm ? firm.description : ''}</p>
      <Link to={`${match.url}/employees`} className="btn btn-primary my-1">
        Employees
      </Link>
      <Link to={`${match.url}/documents`} className="btn btn-primary my-1">
        Documents
      </Link>
      <Link to={`${match.url}/positions`} className="btn btn-primary my-1">
        Positions
      </Link>

      <hr />

      <Switch>
        <PrivateRoute path={`${match.url}/employees`} component={Employees} />
        <PrivateRoute path={`${match.url}/documents`} component={Documents} />
        <PrivateRoute
          path={`${match.url}/positions`}
          component={Positions}
          componentOptions={{ parentId: null }}
        />
      </Switch>
    </Fragment>
  );
};

Company.propTypes = {
  company: PropTypes.object.isRequired,
  getCompany: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  company: state.company,
});

export default connect(mapStateToProps, { getCompany })(Company);
