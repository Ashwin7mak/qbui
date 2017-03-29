import {combineReducers} from 'redux';
import AccountUsers from '../account/users/AccountUsersReducer';
import RequestContext from '../common/requestContext/RequestContextReducer';
import CommonNavReducer from '../../../reuse/client/src/components/sideNavs/commonNavReducer';

export default combineReducers({
    Nav: CommonNavReducer(),
    AccountUsers,
    RequestContext
});
