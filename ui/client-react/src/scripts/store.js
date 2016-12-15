import rootReducer from '../reducers/root';
import {createStore,compose} from 'redux';

export default function createAppStore() {
    //const store = createStore(rootReducer);
    return createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}
