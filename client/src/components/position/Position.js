import React, { useState } from 'react';
import { connect } from 'react-redux';

import { deletePosition } from '../../store/actions/positions';

import Positions from './Positions';

const Position = ({ position, index, deletePosition }) => {
  const [isExpanded, toggleExpand] = useState(false);

  return (
    <div
      key={position._id}
      className={index % 2 === 0 ? 'background-blue' : 'background-white'}
    >
      <h2 className="inline-block">{position.title}</h2>

      <div className="operation-buttons">
        <i
          onClick={() => {
            deletePosition(position._id);
          }}
          className="fas fa-trash-alt mx-1 pointer"
        ></i>
        <i
          className={`${
            isExpanded ? 'fas' : 'far'
          } fa-caret-square-down pointer`}
          onClick={() => {
            toggleExpand(!isExpanded);
          }}
        ></i>
      </div>

      {isExpanded ? (
        <div className="ml-1">
          <Positions parentId={position._id} colorCompensation={1} />
        </div>
      ) : null}
    </div>
  );
};

export default connect(null, { deletePosition })(Position);
