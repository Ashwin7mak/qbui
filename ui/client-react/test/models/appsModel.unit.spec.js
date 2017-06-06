import AppsModel from '../../src/models/appsModel';

const appsData = [
    {'id': 1}, {'id': 2}
];

describe('APP Model', () => {

    it('Initialize apps model object', () => {
        let model = new AppsModel(appsData);

        const appsModel = model.get();
        expect(appsModel.apps.length).toEqual(2);

        const apps = model.getApps();
        expect(apps.length).toEqual(2);
    });

    it('Initialize apps model object with no apps', () => {
        let model = new AppsModel();

        const appsModel = model.get();
        expect(appsModel.apps.length).toEqual(0);

        const apps = model.getApps();
        expect(apps.length).toEqual(0);
    });

});
