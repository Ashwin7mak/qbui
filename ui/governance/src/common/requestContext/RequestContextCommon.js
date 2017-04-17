export const checkDataFetchingError = (error) => {
    //if it's a redirect error, do not display the 'error' text and show spinner
    if (error && error.data && error.data.statusCode === 401) {
        return null;
    }
    return error;
};
