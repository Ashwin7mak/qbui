import NavigationUtils, {__RewireAPI__ as NavigationUtilsRewireAPI} from '../../src/utils/navigationUtils';
import StringUtils from '../../src/utils/stringUtils';
import {TABLE_LINK} from '../../src/constants/urlConstants';

const AppHistoryMock = {
    history: {goBack() {}, push(_location) {}},
};
const testDefaultLocation = '/go/go/power/rangers';

describe('NavigationUtils', () => {
    beforeEach(() => {
        spyOn(AppHistoryMock.history, 'goBack');
        spyOn(AppHistoryMock.history, 'push');
        NavigationUtilsRewireAPI.__Rewire__('AppHistory', AppHistoryMock);
    });

    afterEach(() => {
        NavigationUtilsRewireAPI.__ResetDependency__('AppHistory');
    });

    describe('goBackToPreviousLocation', () => {
        it('redirects to a previous page within the current domain (i.e., quickbase or localhost)', () => {
            spyOn(NavigationUtils, 'referrer').and.returnValue('quickbase.com');

            NavigationUtils.goBackToPreviousLocation();

            expect(AppHistoryMock.history.goBack).toHaveBeenCalled();
            expect(AppHistoryMock.history.push).not.toHaveBeenCalled();
        });

        it('redirects to a default location if going back would leave the current domain (i.e., quickbase or localhost)', () => {
            spyOn(NavigationUtils, 'referrer').and.returnValue('');

            NavigationUtils.goBackToPreviousLocation(testDefaultLocation);

            expect(AppHistoryMock.history.push).toHaveBeenCalledWith(testDefaultLocation);
            expect(AppHistoryMock.history.goBack).not.toHaveBeenCalled();
        });
    });

    describe('goBackToLocationOrTable', () => {
        const testAppId = '5Teenagers';
        const testTableId = 'WithAttitude';

        it('goes back to the previous route if provided', () => {
            const testPreviousRoute = '/highSchools/AngelGrove';
            NavigationUtils.goBackToLocationOrTable(testAppId, testTableId, testPreviousRoute);

            expect(AppHistoryMock.history.push).toHaveBeenCalledWith(testPreviousRoute);
            expect(AppHistoryMock.history.goBack).not.toHaveBeenCalled();
        });

        it('goes back to the previous page if within the current domain', () => {
            spyOn(NavigationUtils, 'referrer').and.returnValue('localhost');

            NavigationUtils.goBackToLocationOrTable(testAppId, testTableId);

            expect(AppHistoryMock.history.goBack).toHaveBeenCalled();
            expect(AppHistoryMock.history.push).not.toHaveBeenCalled();
        });

        it('goes to the default table report if going back would cause the user to leave quickbase', () => {
            spyOn(NavigationUtils, 'referrer').and.returnValue('');

            NavigationUtils.goBackToLocationOrTable(testAppId, testTableId);

            expect(AppHistoryMock.history.push).toHaveBeenCalledWith(StringUtils.format(TABLE_LINK, [testAppId, testTableId]));
            expect(AppHistoryMock.history.goBack).not.toHaveBeenCalled();
        });
    });
});
