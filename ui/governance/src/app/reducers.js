import {combineReducers} from 'redux';
import AccountUsers from '../account/users/AccountUsersReducer';
import RequestContext from '../common/requestContext/RequestContextReducer';
import CommonNavReducer from '../../../reuse/client/src/components/sideNavs/commonNavReducer';
import StandardGridReducer from '../common/grid/standardGridReducer';

export default combineReducers({
    Nav: CommonNavReducer(),
    Grids: StandardGridReducer,
    AccountUsers,
    RequestContext
});
