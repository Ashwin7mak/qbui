import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers/root';

export default function createAppStore() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const defaultState = {};
    return createStore(rootReducer,
        defaultState,
        composeEnhancers(applyMiddleware(thunk))
     );
}
