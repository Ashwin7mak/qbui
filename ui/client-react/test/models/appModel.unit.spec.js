import AppModel from '../../src/models/appModel';

const appData = {
    app: {
        id: '1',
        tables: [
            {id:'tableId'}
        ]
    },
    users: [
        {'id':1, 'type':'users'},
        {
            'VIEWER': [{id:1}],
            'ADMIN': [{id:2}]
        }
    ]
};

describe('APP Model', () => {

    it('Initialize app model object', () => {
        let appModel = new AppModel(appData);

        expect(appModel.getApp()).toEqual(appData.app);
        expect(appModel.getAppId()).toEqual(appData.app.id);
        expect(appModel.getUsers()).toEqual(appData.users[0]);

        const unfilteredUsers = appModel.getUnfilteredUsers();
        expect(unfilteredUsers).toEqual(appData.users[1]);

        const roleId = 'VIEWER';
        expect(appModel.getUnfilteredUsersByRole(roleId)).toEqual(appData.users[1][roleId]);
    });

    it('Initialize app model object with no data', () => {
        let appModel = new AppModel();

        const emptyApp = {};
        expect(appModel.getApp()).toEqual(emptyApp);
        expect(appModel.getAppId()).toEqual(emptyApp.id);
        expect(appModel.getUsers()).toEqual([]);

        const unfilteredUsers = appModel.getUnfilteredUsers();
        const roleId = 'VIEWER';
        expect(unfilteredUsers).toEqual([]);
        expect(appModel.getUnfilteredUsersByRole(roleId)).toEqual([]);
    });

    it('Initialize app model object with no data and then manually set', () => {
        let oldAppModel = new AppModel(appData);

        let appModel = new AppModel();
        appModel.setApp(oldAppModel.getApp());
        expect(appModel.getAppId()).toEqual(appData.app.id);

        const updatedUsers = [
            {'id':2, 'type':'users'},
            {
                'ADMIN': [{id:10}]
            }
        ];
        appModel.setUsers(updatedUsers);
        expect(appModel.getUsers()).not.toEqual(appData.users[0]);
        expect(appModel.getUsers()).toEqual(updatedUsers);

        const unfilteredParticipantUsers = [{id:2}];
        const roleId = 'PARTICIPANT';
        appModel.setUnfilteredUsersByRole(unfilteredParticipantUsers, roleId);
        expect(appModel.getUnfilteredUsersByRole(roleId)).toEqual(unfilteredParticipantUsers);
    });

});
