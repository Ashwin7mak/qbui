import {combineReducers} from 'redux';
import AccountUsers from '../account/users/AccountUsersReducer';
import RequestContext from '../common/requestContext/RequestContextReducer';

export default combineReducers({
    AccountUsers,
    RequestContext
});
