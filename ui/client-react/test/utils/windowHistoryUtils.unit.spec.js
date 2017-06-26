import {WindowHistoryUtils, __RewireAPI__ as RewireAPI} from '../../src/utils/windowHistoryUtils';
import WindowLocationUtils from '../../src/utils/windowLocationUtils';

describe('WindowHistoryUtils', () => {
    const AppHistoryMock = {
        history: {
            push: jasmine.createSpy('push')
        }
    };

    const mockPath = '/path/to/all/the/things';
    // be careful with the query parameter order, because order shouldn't matter
    const mockSearch = '?Digits=small&Name=Trump';

    const WindowLocationUtilsMock = {
        getPathname: () => mockPath,
        getSearch: () => mockSearch,
        buildQueryString: WindowLocationUtils.buildQueryString
    };

    beforeAll(() => {
        RewireAPI.__Rewire__('AppHistory', AppHistoryMock);
        RewireAPI.__Rewire__('WindowLocationUtils', WindowLocationUtilsMock);
    });

    afterAll(() => {
        RewireAPI.__ResetDependency__('AppHistory');
        RewireAPI.__ResetDependency__('WindowLocationUtils');
    });

    beforeEach(() => {
        AppHistoryMock.history.push.calls.reset();
    });

    it('pushWithQuery pushes pathname with query to history', () => {
        WindowHistoryUtils.pushWithQuery();
        expect(AppHistoryMock.history.push).toHaveBeenCalledWith(mockPath + mockSearch);
    });

    it('pushWithQuery pushes pathname with passed in query to history', () => {
        WindowHistoryUtils.pushWithQuery('rick', 'roll');
        expect(AppHistoryMock.history.push).toHaveBeenCalledWith(mockPath + mockSearch + '&rick=roll');
    });

    it('pushWithQueries pushes pathname with passed in queries to history', () => {
        const params = {
            Trusty: 'Tahr',
            Xenial: 'Xerus',
            Yakkety: 'Yak'
        };
        WindowHistoryUtils.pushWithQueries(params);
        expect(AppHistoryMock.history.push).toHaveBeenCalledWith(mockPath + mockSearch + '&Trusty=Tahr&Xenial=Xerus&Yakkety=Yak');
    });

    it('pushWithoutQuery pushes pathname to history', () => {
        WindowHistoryUtils.pushWithoutQuery();
        expect(AppHistoryMock.history.push).toHaveBeenCalledWith(mockPath);
    });
});
