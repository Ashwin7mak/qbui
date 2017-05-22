import automationsModel from '../../src/models/automationsModel';


describe('Automation model', () => {

    let automationsFromServer = [
        {id: 'auto1', name: 'Auto 1', unused: 'TEST'},
        {id: 'auto2', name: 'Auto 2', unused: 'TEST'}
    ];

    it('set automations on model', () => {
        let model = automationsModel.set('test_app', automationsFromServer);

        expect(model).toEqual({appId: 'test_app', automationsList: [
                {id: 'auto1', name: 'Auto 1'},
                {id: 'auto2', name: 'Auto 2'}
        ]});
    });
});
