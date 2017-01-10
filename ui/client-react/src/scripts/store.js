import thunk from 'redux-thunk';

import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers/root';

// create app store
export default function createAppStore() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;  // support Redux Chrome extension
    const defaultState = {};

    // in dev mode only, demand-load redux-immutable-state-invariant to automatically detect mutations in reducers
    const middleware = process.env.NODE_ENV !== 'production' ?
        [require('redux-immutable-state-invariant')(), thunk] :
        [thunk];

    return createStore(rootReducer,
        defaultState,
        composeEnhancers(applyMiddleware(...middleware)) // add redux-thunk to support async action creators
     );
}
