//
// Define logging levels on the client
//
// The 'bunyanLevel' is a case-sensitive, bunyan specific logging name that is passed
// to Node when logging the message on the server.  DO NOT CHANGE.
//
export default {
    DEBUG: {id: 40, name: 'DEBUG', bunyanLevel: 'debug'},
    INFO: {id: 30, name: 'INFO', bunyanLevel: 'info'},
    WARN: {id: 20, name: 'WARN', bunyanLevel: 'warn'},
    ERROR: {id: 10, name: 'ERROR', bunyanLevel: 'error'},
    OFF: {id: 0, name: 'OFF', bunyanLevel: ''}
};
