import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import EmployeeForm from './EmployeeForm';
import { Spinner } from '../layout';
import {
  getEmployees,
  deleteEmployee,
  clearEmployees,
} from '../../store/actions/employees';

const Employees = ({
  match,
  employees: { employees: employeesArray, employeesLoading },
  company,
  getEmployees,
  deleteEmployee,
  clearEmployees,
}) => {
  const [isFormShown, toggleForm] = useState(false);
  // const history = useHistory();

  useEffect(() => {
    getEmployees(company);

    return clearEmployees;
  }, [getEmployees]);

  if (employeesLoading) return <Spinner />;

  return (
    <Fragment>
      <div>
        <button
          onClick={() => {
            toggleForm(!isFormShown);
          }}
          className="btn btn-primary my-1"
        >
          {isFormShown ? 'Hide Form' : 'Add Employee'}
        </button>
      </div>

      {isFormShown ? <EmployeeForm companyId={company} /> : null}

      {!employeesArray.length ? (
        <p>No employees found</p>
      ) : (
        <Fragment>
          {employeesArray.map((employee, index) => {
            return (
              <div
                key={employee._id}
                className={index % 2 === 0 ? 'background-blue' : ''}
              >
                <h2 className="inline-block">{employee.name}</h2>
                <div className="operation-buttons">
                  <i className="far fa-edit mx-1"></i>
                  <i
                    onClick={() => {
                      deleteEmployee(employee._id);
                    }}
                    className="fas fa-trash-alt"
                  ></i>
                </div>
              </div>
            );
          })}
        </Fragment>
      )}
    </Fragment>
  );
};

Employees.propTypes = {
  employees: PropTypes.object.isRequired,
  getEmployees: PropTypes.func.isRequired,
  company: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  employees: state.employees,
  company: state.company.firm._id,
});

export default connect(mapStateToProps, {
  getEmployees,
  deleteEmployee,
  clearEmployees,
})(Employees);
