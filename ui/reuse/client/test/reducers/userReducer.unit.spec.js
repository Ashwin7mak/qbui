import UserReducer, {getLoggedInUser, getLoggedInUserId, getLoggedInUserAdminStatus} from 'REUSE/reducers/userReducer';
import {UPDATE_USER_LOADING_STATUS, UPDATE_LOGGED_IN_USER} from 'REUSE/actions/userActions';

const mockUser = {id: 13, administrator: true};

describe('User Reducer', () => {
    it('updates the loading status for the user', () => {
        let result = UserReducer({isLoading: false}, {type: UPDATE_USER_LOADING_STATUS, isLoading: true});

        expect(result).toEqual({isLoading: true});
    });

    it('updates the currently logged in user', () => {
        let result = UserReducer({isLoading: false}, {type: UPDATE_LOGGED_IN_USER, user: mockUser, isLoading: true});

        expect(result).toEqual({...mockUser, isLoading: true});
    });

    it('has a default state', () => {
        expect(UserReducer(undefined, {})).toEqual({isLoading: false});
    });

    describe('getLoggedInUser', () => {
        it('gets the currently logged in user from state', () => {
            expect(getLoggedInUser({user: mockUser})).toEqual(mockUser);
        });
    });

    describe('getLoggedInUserId', () => {
        it('gets the user id of the currently logged in user from state', () => {
            expect(getLoggedInUserId({user: mockUser})).toEqual(mockUser.id);
        });

        it('returns undefined if there is no user in the state', () => {
            expect(getLoggedInUserId({})).toEqual(undefined);
        });
    });

    describe('getLoggedInUserAdminStatus', () => {
        it('gets the admin status of the currently logged in user from state', () => {
            expect(getLoggedInUserAdminStatus({user: mockUser})).toEqual(mockUser.administrator);
        });

        it('returns undefined if there is no user in the state', () => {
            expect(getLoggedInUserAdminStatus({})).toEqual(undefined);
        });
    });
});
