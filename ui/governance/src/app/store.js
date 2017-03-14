import thunk from 'redux-thunk';

import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from './reducers';
import Configuration from '../../../client-react/src/config/app.config';

// create app store
export default function createGovernanceStore() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;  // support Redux Chrome extension
    const defaultState = {};

    const middleware = [thunk];

    // in dev mode and if specified,  use redux-immutable-state-invariant to automatically log mutations in reducers
    if (process.env.NODE_ENV !== 'production' && Configuration.detectInvalidMutations) {
        middleware.push(require('redux-immutable-state-invariant')());
    }

    return createStore(rootReducer,
        defaultState,
        composeEnhancers(applyMiddleware(...middleware)) // add redux-thunk to support async action creators
     );
}
