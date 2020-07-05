import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import CompanyForm from './CompanyForm';
import { Spinner } from '../layout';
import {
  getCompanies,
  deleteCompany,
  getSelfCompanies,
} from '../../store/actions/company';

const Companies = ({
  self = false,
  company: { companies, companiesLoading },
  getCompanies,
  getSelfCompanies,
  deleteCompany,
  profile,
}) => {
  const [isFormShown, toggleForm] = useState(false);

  useEffect(() => {
    self ? getSelfCompanies() : getCompanies(profile.user._id);
  }, [getCompanies, getSelfCompanies]);

  const history = useHistory();

  if (companiesLoading) return <Spinner />;

  return (
    <Fragment>
      <h1 className="large text-primary">
        {self ? 'Your companies' : 'Profile companies'}
      </h1>
      {self ? (
        <button
          onClick={() => {
            toggleForm(!isFormShown);
          }}
          className="btn btn-primary my-1"
        >
          {isFormShown ? 'Hide Form' : 'Add Company'}
        </button>
      ) : null}
      {isFormShown ? <CompanyForm isEdit={false} /> : null}
      {companies.map((company, index) => {
        return (
          <div
            key={company._id}
            className={index % 2 === 0 ? 'background-blue' : ''}
          >
            <h2
              className={self ? 'pointer' : ''}
              onClick={() => {
                if (self) history.push(`/company/${company._id}/employees`);
              }}
            >
              {company.name}
            </h2>
            <p>{company.description}</p>
            {self ? (
              <Fragment>
                <i
                  onClick={() => {
                    deleteCompany(company._id);
                  }}
                  className="fas fa-trash-alt m-1 pointer"
                ></i>
                <i className="far fa-edit m-1"></i>
              </Fragment>
            ) : null}
          </div>
        );
      })}
    </Fragment>
  );
};

Companies.propTypes = {
  getCompanies: PropTypes.func.isRequired,
  deleteCompany: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  company: state.company,
  profile: state.profile.profile,
});

export default connect(mapStateToProps, {
  getCompanies,
  getSelfCompanies,
  deleteCompany,
})(Companies);
