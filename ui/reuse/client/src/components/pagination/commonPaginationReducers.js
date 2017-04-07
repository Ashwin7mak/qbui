import { handleActions } from 'redux-actions';

import {
  CHANGE_PAGE_NUMBER
} from './commonPaginationTypes';

const defaultState = (configs = {}) => ({
  page: 0,
  pageSize: 20,
});

const paginationBehaviours = {
  [CHANGE_PAGE_NUMBER]: (state, { payload }) => {
    const nextOrPreviousState = {
      ...defaultState(payload.configs),
      ...state,
      ...payload,
    };
    return {
    ...nextOrPreviousState,
    page: payload.page,
  }
},
};

export const commonPaginationReducer = handleActions(paginationBehaviours);
