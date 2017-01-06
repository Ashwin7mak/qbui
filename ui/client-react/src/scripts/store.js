import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers/root';

// create app store
export default function createAppStore() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;  // support Redux Chrome extension
    const defaultState = {};
    return createStore(rootReducer,
        defaultState,
        composeEnhancers(applyMiddleware(thunk)) // add redux-thunk to support async action creators
     );
}
