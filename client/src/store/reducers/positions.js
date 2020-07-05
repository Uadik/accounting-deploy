import { positionsConstants } from '../constants/positions';

const {
  CREATE_POSITION,
  GET_POSITIONS_REQUEST,
  GET_POSITIONS_SUCCESS,
  CLEAR_POSITIONS,
  DELETE_POSITION,
} = positionsConstants;

const initialState = {
  positions: [],
  positionsTrees: [],
  loadingPositions: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSITIONS_REQUEST:
      return {
        ...state,
        loadingPositions: true,
      };
    case GET_POSITIONS_SUCCESS: {
      const { positions, parentId } = payload;

      if (parentId === null) {
        return {
          ...state,
          loadingPositions: false,
          positions,
          positionsTrees: positions.map((pos) => ({
            parent: pos.parent,
            _id: pos._id,
            positions: [],
          })),
        };
      }

      return {
        ...state,
        loadingPositions: false,
        positions: [...state.positions, ...positions],
        positionsTrees: putArrayToElement(
          state.positionsTrees,
          parentId,
          positions.map((pos) => ({
            parent: pos.parent,
            _id: pos._id,
            positions: [],
          }))
        ),
      };
    }
    case CREATE_POSITION:
      return {
        ...state,
        positions: [...state.positions, payload],
        positionTrees: insertElement(state.positionsTrees, {
          parent: payload.parent,
          _id: payload._id,
          positions: [],
        }),
      };
    case DELETE_POSITION:
      return {
        ...state,
        positions: [...state.positions.filter((pos) => pos._id !== payload)],
        positionsTrees: [
          ...state.positionsTrees.filter((pos) => pos._id !== payload),
        ],
      };
    case CLEAR_POSITIONS: {
      return {
        ...state,
        positions: [...state.positions.filter((pos) => pos.parent !== payload)],
        positionsTrees: clearRecursively(state.positionsTrees, payload),
      };
    }

    default:
      return state;
  }
}

// Insert element
const insertElement = (parents, element) => {
  parents.find((pos) => {
    if (pos._id === element.parent) {
      pos.positions = [...pos.positions, element];
      return true;
    } else if (pos.positions && pos.positions.length !== 0) {
      insertElement(pos.positions, element);
      return true;
    }
    return true;
  });
  return parents;
};

// Clear positions
const clearRecursively = (parents, parentId) => {
  // find recursively
  parents.find((pos) => {
    if (pos._id === parentId) {
      pos.positions = [];
      return true;
    } else if (pos.positions && pos.positions.length !== 0) {
      clearRecursively(pos.positions, parentId);
      return true;
    }
    return true;
  });
  return parents;
};

// Take parents array and put positionsArray to element with parentId
const putArrayToElement = (parents, parentId, positionsArray) => {
  parents.find((pos) => {
    if (pos._id === parentId) {
      pos.positions = positionsArray;
      return true;
    } else if (pos.positions && pos.positions.length !== 0) {
      putArrayToElement(pos.positions, parentId, positionsArray);
      return true;
    }
    return true;
  });
  return parents;
};
