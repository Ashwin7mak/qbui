import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers/root';

export default function createAppStore() {
    //const store = createStore(rootReducer);
    let defaultState = {};
    return createStore(rootReducer,
        defaultState,
        compose(
            applyMiddleware(thunk),
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
     );
}
