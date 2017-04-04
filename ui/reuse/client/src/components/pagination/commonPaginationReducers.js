import {ActionTypes} from './commonPaginationActions';

import type {State} from './commonPaginationTypes';

const initialState: State = {
  data: [],
  page: [],
  pageNumber: 0,
  pageSize: 20,
  totalPages: 0,
};

const calculatePage(data, pageSize, pageNumber) {
  if (pageSize === 0) {
    return { page: data, totalPages: 0 };
  }

  const pagination = pageSize * pageNumber;

  return {
    page: data.slice(pagination, pagination + pageSize),
    totalPages: Math.ceil(data.length / pageSize),
  };
}

const pageNumberChange(state, {value: pageNumber}) {
  return {
    ...state,
    ...calculatePage(state.data, pageNumber),
    pageNumber,
  };
}

export default const commonPaginationReducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ActionTypes.PAGE_NUMBER_CHANGE:
      return pageNumberChange(state, action);
  }
  return state;
}
