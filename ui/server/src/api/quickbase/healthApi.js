/**
 * Health Check API
 * Used to determine if a deployed instance is functioning (i.e., accepting requests)
 * TODO: Add a deepHealthCheck that also verifies this instance is connected to related services (EE & Core)
 * @param config
 * @returns {*}
 */
module.exports = config => {
     return {
         getShallowHealthCheck(_request = null) {
             return Promise.resolve({message: 'Shallow health check succeeded. QBUI is accepting requests.'});
         }
     };
};
