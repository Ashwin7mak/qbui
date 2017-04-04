export const ActionTypes = {
  PAGE_NUMBER_CHANGE: 'PAGE_NUMBER_CHANGE',
};

export const pageNumberChange = (value) => ({value, type: ActionTypes.PAGE_NUMBER_CHANGE });
