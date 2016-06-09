import ReactPerfUtils from '../../src/utils/perf/reactPerfUtils';

describe('ReactPerfUtils', () => {
    'use strict';
    let originalRequireReactPerfFunction = ReactPerfUtils.requireReactDefaultPerf;

    var mockReactPerf = {
        start() { },
        stop() { },
        getLastMeasurements() { },
        printInclusive(param) { },
        printExclusive(param) { },
        printWasted(param) { },
        printDOM(param) { }
    };

    beforeEach(() => {
        ReactPerfUtils.requireReactDefaultPerf = function() {
            return mockReactPerf;
        };
        spyOn(mockReactPerf, 'start').and.callThrough();
        spyOn(mockReactPerf, 'stop').and.callThrough();
        spyOn(mockReactPerf, 'getLastMeasurements').and.callThrough();
        spyOn(mockReactPerf, 'printInclusive').and.callThrough();
        spyOn(mockReactPerf, 'printExclusive').and.callThrough();
        spyOn(mockReactPerf, 'printWasted').and.callThrough();
        spyOn(mockReactPerf, 'printDOM').and.callThrough();

    });

    afterEach(() => {
        mockReactPerf.start.calls.reset();
        mockReactPerf.stop.calls.reset();
        mockReactPerf.getLastMeasurements.calls.reset();
        mockReactPerf.printInclusive.calls.reset();
        mockReactPerf.printExclusive.calls.reset();
        mockReactPerf.printWasted.calls.reset();
        mockReactPerf.printDOM.calls.reset();
        delete window.nodeConfig;
        ReactPerfUtils.requireReactDefaultPerf = originalRequireReactPerfFunction;
    });

    it('test devPerfInit function no params', () => {
        expect(ReactPerfUtils.devPerfInit).toBeTruthy();
        expect(ReactPerfUtils.devPerfInit()).toBeUndefined();
    });

    describe('test devPerfInit function falsy parms', () => {
        let nonProdConfig = {env: "nonProd"};
        let prodConfig = {env: "PROD"};
        let noTrackingNodeConfig = {isPerfTrackingEnabled: false};
        let enableTrackingNodeConfig = {isPerfTrackingEnabled: true};
        let globalRecipient = {};
        let dataProvider = [
            {type: "no envConfig, no nodeConfig, no globalRecipient",
                config:null, nodeConfig:null, global:null},
            {type: "undefined envConfig, undefined nodeConfig, undefined globalRecipient",
                config:undefined, nodeConfig:undefined, global:undefined},
            {type: "no envConfig, no nodeConfig, a globalRecipient",
                config:null, nodeConfig:null, global:globalRecipient},
            {type: "no envConfig, a false nodeConfig, a globalRecipient",
                config:null, nodeConfig:noTrackingNodeConfig, global:globalRecipient},
            {type: "no envConfig, a true nodeConfig, a globalRecipient",
                config:null, nodeConfig:enableTrackingNodeConfig, global:globalRecipient},

            {type: "prod envConfig, no nodeConfig, no globalRecipient",
                config:prodConfig, nodeConfig:null, global:null},
            {type: "prod envConfig, undefined nodeConfig, undefined globalRecipient",
                config:prodConfig, nodeConfig:undefined, global:undefined},
            {type: "prod envConfig, no nodeConfig, a globalRecipient",
                config:prodConfig, nodeConfig:null, global:globalRecipient},
            {type: "prod envConfig, a false nodeConfig, a globalRecipient",
                config:prodConfig, nodeConfig:noTrackingNodeConfig, global:globalRecipient},
            {type: "prod envConfig, a true nodeConfig, a globalRecipient",
                config:prodConfig, nodeConfig:enableTrackingNodeConfig, global:globalRecipient},

            {type: "nonProd envConfig, no nodeConfig, no globalRecipient",
                config:nonProdConfig, nodeConfig:null, global:null},
            {type: "nonProd envConfig, undefined nodeConfig, undefined globalRecipient",
                config:nonProdConfig, nodeConfig:undefined, global:undefined},
            {type: "nonProd envConfig, no nodeConfig, a globalRecipient",
                config:nonProdConfig, nodeConfig:null, global:globalRecipient},
            {type: "nonProd envConfig, a false nodeConfig, a globalRecipient",
                config:nonProdConfig, nodeConfig:noTrackingNodeConfig, global:globalRecipient},
        ];
        dataProvider.forEach((test) => {
            it(test.type, () => {
                let originalGlobal = test.global;
                window.nodeConfig = noTrackingNodeConfig;
                let result = ReactPerfUtils.devPerfInit(test.config, test.global);
                expect(test.global).toEqual(originalGlobal);
                expect(mockReactPerf.start).not.toHaveBeenCalled();
                expect(result).toBeUndefined();
            });
        });
    });

    describe('test devPerfInit function true parms', () => {
        let nonProdConfig = {env: "nonProd"};
        let noTrackingNodeConfig = {isPerfTrackingEnabled: false};
        let enableTrackingNodeConfig = {isPerfTrackingEnabled: true};
        let globalRecipient = {some: "values"};
        let dataProvider = [
            {type: "nonProd envConfig, a true nodeConfig, a globalRecipient",
                 config:nonProdConfig, nodeConfig:enableTrackingNodeConfig, global:globalRecipient},
            {type: "nonProd envConfig, a true nodeConfig, no globalRecipient",
                config:nonProdConfig, nodeConfig:enableTrackingNodeConfig, global:null},                             {type: "nonProd envConfig, a true nodeConfig, undefined globalRecipient",
                 config:nonProdConfig, nodeConfig:enableTrackingNodeConfig, global:undefined},
        ];
        dataProvider.forEach((test) => {
            it(test.type, () => {
                let expectedGlobal = test.global ;
                if (test.global) {
                    expectedGlobal = Object.assign({}, test.global);
                    expectedGlobal.Perf = mockReactPerf;
                }
                window.nodeConfig = test.nodeConfig;
                let result = ReactPerfUtils.devPerfInit(test.config, test.global);
                expect(test.global).toEqual(expectedGlobal);
                expect(mockReactPerf.start).toHaveBeenCalled();
                expect(result).toEqual(mockReactPerf);
            });
        });
    });

    it('test devPerfPrint function no params', () => {
        expect(ReactPerfUtils.devPerfPrint).toBeTruthy();
        expect(ReactPerfUtils.devPerfPrint()).toBeUndefined();
        expect(mockReactPerf.printInclusive).not.toHaveBeenCalled();
    });

    describe('test devPerfPrint function falsy parms', () => {
        let nonProdConfig = {env: "nonProd"};
        let prodConfig = {env: "PROD"};
        let noTrackingNodeConfig = {isPerfTrackingEnabled: false};
        let enableTrackingNodeConfig = {isPerfTrackingEnabled: true};
        let globalRecipient = {};
        let dataProvider = [
            {type: "no envConfig, no nodeConfig, no reactPerf",
                config:null, nodeConfig:null, reactPerf:null},
            {type: "undefined envConfig, no nodeConfig, undefined reactPerf",
                config:undefined, nodeConfig:null, reactPerf:undefined},
            {type: "non prod envConfig, no nodeConfig, no reactPerf",
                config:nonProdConfig, nodeConfig:null, reactPerf:null},
            {type: "non prod envConfig, false nodeConfig, no reactPerf",
                config:nonProdConfig, nodeConfig:noTrackingNodeConfig, reactPerf:null},
            {type: "non prod envConfig, true nodeConfig, no reactPerf",
                config:nonProdConfig, nodeConfig:enableTrackingNodeConfig, reactPerf:null},
            {type: "prod envConfig, no nodeConfig, undefined reactPerf",
                config:prodConfig, nodeConfig:null, reactPerf:undefined},
            {type: "prod envConfig, false nodeConfig, no reactPerf",
                config:prodConfig, nodeConfig:noTrackingNodeConfig, reactPerf:null},
            {type: "prod envConfig, false nodeConfig, no reactPerf",
                config:prodConfig, nodeConfig:noTrackingNodeConfig, reactPerf:null},
            {type: "prod envConfig, true nodeConfig, no reactPerf",
                config:prodConfig, nodeConfig:enableTrackingNodeConfig, reactPerf:null},
        ];
        dataProvider.forEach(test =>{
            it(test.type, () =>{
                expect(ReactPerfUtils.devPerfPrint).toBeTruthy();
                expect(ReactPerfUtils.devPerfPrint(test.config, test.reactPerf)).toBeUndefined();
                expect(mockReactPerf.stop).not.toHaveBeenCalled();
                expect(mockReactPerf.getLastMeasurements).not.toHaveBeenCalled();
                expect(mockReactPerf.printInclusive).not.toHaveBeenCalled();
                expect(mockReactPerf.printExclusive).not.toHaveBeenCalled();
                expect(mockReactPerf.printWasted).not.toHaveBeenCalled();
                expect(mockReactPerf.printDOM).not.toHaveBeenCalled();
            });
        });
    });

    it('test devPerfPrint function true parms', () => {
        let nonProdConfig = {env: "local"};
        window.nodeConfig = {isPerfTrackingEnabled: true};
        let returnVal = ReactPerfUtils.devPerfPrint(nonProdConfig, mockReactPerf);
        expect(returnVal).toBeUndefined();
        expect(mockReactPerf.stop).toHaveBeenCalled();
        expect(mockReactPerf.getLastMeasurements).toHaveBeenCalled();
        expect(mockReactPerf.printInclusive).toHaveBeenCalled();
        expect(mockReactPerf.printExclusive).toHaveBeenCalled();
        expect(mockReactPerf.printWasted).toHaveBeenCalled();
        expect(mockReactPerf.printDOM).toHaveBeenCalled();
    });
});
