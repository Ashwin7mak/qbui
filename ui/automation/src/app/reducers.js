import {combineReducers} from 'redux';
import CommonNavReducer from '../../../reuse/client/src/components/sideNavs/commonNavReducer';

export default combineReducers({
    Nav: CommonNavReducer()
});
