import { handleActions } from 'redux-actions';

import {
  CHANGE_PAGE_NUMBER
} from './commonPaginationTypes';

const defaultState = (configs = {}) => ({
  page: 0,
  pageSize: 20,
});

const behaviours = {
  [CHANGE_PAGE_NUMBER]: (state, { payload }) => {
    const nextState = {
      ...defaultState(payload.configs),
      ...state,
      ...payload,
    };
    return {
    ...nextState,
    page: payload.page,
  }
  }),
};

export const commonPaginationReducer = handleActions(behaviours);
