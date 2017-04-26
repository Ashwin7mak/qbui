import UserReducer, {getLoggedInUser, getLoggedInUserId} from '../../../src/components/user/userReducer';
import {UPDATE_USER_LOADING_STATUS, UPDATE_LOGGED_IN_USER} from '../../../src/components/user/userActionTypes';

const mockUser = {id: 13};

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

        it('gets the user id of the currently logged in user from state', () => {
            expect(getLoggedInUserId({user: mockUser})).toEqual(mockUser.id);
        });
    });
});
