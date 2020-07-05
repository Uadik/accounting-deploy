import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Spinner } from '../layout';
import PositionForm from './PositionForm';
import Position from './Position';

import { getPositions, clearPositions } from '../../store/actions/positions';

const Positions = ({
  getPositions,
  clearPositions,
  company,
  positions: { positions: positionsArray },
  parentId,
  colorCompensation = 0,
}) => {
  const [isFormShown, toggleForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPositions(company, parentId, setLoading);

    return function () {
      clearPositions(parentId);
    };
  }, [getPositions]);

  if (loading) return <Spinner />;

  return (
    <div>
      <button
        onClick={() => {
          toggleForm(!isFormShown);
        }}
        className="btn btn-primary"
      >
        {isFormShown ? 'Hide Form' : 'Add Position'}
      </button>
      {isFormShown ? (
        <PositionForm companyId={company} parentId={parentId} />
      ) : null}
      {positionsArray
        .filter((pos) => pos.parent === parentId)
        .map((position, index) => {
          return (
            <Position position={position} index={index + colorCompensation} />
          );
        })}
    </div>
  );
};

Positions.propTypes = {
  getPositions: PropTypes.func.isRequired,
  company: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  positions: state.positions,
  company: state.company.firm._id,
});

export default connect(mapStateToProps, { getPositions, clearPositions })(
  Positions
);
