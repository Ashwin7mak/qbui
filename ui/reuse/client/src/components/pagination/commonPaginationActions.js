import {
  CHANGE_PAGE_NUMBER
} from './commonPaginationTypes';

export const pageChanged = (page) => ({
  type: CHANGE_PAGE_NUMBER,
  payload: {
    page,
  },
});
