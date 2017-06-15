import React from 'react';
import {connect} from 'react-redux';
import {getLoggedInUser} from './userActions';
import {getLoggedInUser as getLoggedInUserFromState} from './userReducer';

/**
 * This is a version of the User component that has already been connected to the User reducer and actions.
 * Use this version if you are using redux. Remember to add the User reducer to your root reducer.
 */
import User from './user';

const mapStateToProps = state => ({user: getLoggedInUserFromState(state)});

export default connect(mapStateToProps, {getLoggedInUser})(User);
