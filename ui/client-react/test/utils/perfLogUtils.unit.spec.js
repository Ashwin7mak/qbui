import PerfLogUtils from '../../src/utils/perf/perfLogUtils';
import Logger from '../../src/utils/logger';
describe('PerfLogUtils', () => {
    describe('PerfLogUtils flag enabled tests', () => {
        'use strict';
        let testChange = 0;
        let mockEPISODES = {
            constructor() {
            },
            mark(note, noteTime) {
            },
            measure(note, startTime, endTime) {
            },
            sendBeacon(url, info) {
            },
            done(cb) {
                if (cb) {
                    return cb();
                }
            },
            dprint() {
            }
        };
        class mockLogService {
            constructor() {
            }

            warn(msg) {
                return msg;
            }
        }
        let logger = new Logger();

        beforeEach(() => {
            window.nodeConfig = {isClientPerfTrackingEnabled: true};
            window.EPISODES = mockEPISODES;

            Logger.__Rewire__('LogService', mockLogService);
            spyOn(logger, 'warn');

            spyOn(mockEPISODES, 'mark').and.callThrough();
            spyOn(mockEPISODES, 'measure').and.callThrough();
            spyOn(mockEPISODES, 'sendBeacon').and.callThrough();
            spyOn(mockEPISODES, 'done').and.callThrough();

        });

        afterEach(() => {
            Logger.__ResetDependency__('LogService');
            logger.warn.calls.reset();
            mockEPISODES.mark.calls.reset();
            mockEPISODES.measure.calls.reset();
            mockEPISODES.sendBeacon.calls.reset();
            mockEPISODES.done.calls.reset();
        });

        it('test isEnabled function', () => {
            expect(PerfLogUtils.isEnabled).toBeTruthy();
            expect(PerfLogUtils.isEnabled()).toBeTruthy();
        });
        it('test mark function', () => {
            expect(PerfLogUtils.mark).toBeTruthy();
            PerfLogUtils.mark();
            expect(mockEPISODES.mark).toHaveBeenCalled();
        });
        it('test mark with data function', () => {
            expect(PerfLogUtils.mark).toBeTruthy();
            PerfLogUtils.mark('test');
            expect(mockEPISODES.mark).toHaveBeenCalledWith('test', undefined);
        });
        it('test measure function', () => {
            expect(PerfLogUtils.measure).toBeTruthy();
            PerfLogUtils.measure();
            expect(mockEPISODES.measure).toHaveBeenCalled();
        });
        it('test send function', () => {
            expect(PerfLogUtils.send).toBeTruthy();
            PerfLogUtils.send();
            expect(mockEPISODES.sendBeacon).toHaveBeenCalled();
        });
        it('test send function with data', () => {
            expect(PerfLogUtils.send).toBeTruthy();
            var param = {this: 'too'};
            PerfLogUtils.send(param);
            expect(mockEPISODES.sendBeacon).toHaveBeenCalled();
            expect(mockEPISODES.sendBeacon.calls.mostRecent().args[1]).toEqual(param);
        });
        it('test done function', () => {
            expect(PerfLogUtils.done).toBeTruthy();
            PerfLogUtils.done();
            expect(mockEPISODES.done).toHaveBeenCalled();
        });
        it('test done function with callback', () => {
            expect(PerfLogUtils.send).toBeTruthy();
            testChange = 0;
            var callback = () => {
                testChange = 5;
            };
            PerfLogUtils.done(callback);
            expect(mockEPISODES.done).toHaveBeenCalled();
            expect(testChange).toEqual(5);
        });
        it('test setLogger function', () => {
            expect(PerfLogUtils.setLogger).toBeTruthy();
            PerfLogUtils.setLogger(logger);
            let theMsg = 'helloFromLogger';
            mockEPISODES.dprint(theMsg);
            expect(logger.warn).toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalledWith(theMsg);
        });

    });

    describe('PerfLogUtils flag disabled tests', () => {
        'use strict';
        let mockEPISODES = {
            constructor() {
            },
            mark(note, noteTime) {
            },
            measure(note, startTime, endTime) {
            },
            sendBeacon(url, info) {
            },
            done(cb) {
                if (cb) {
                    return cb();
                }
            },
            dprint() {
            }
        };
        class mockLogService {
            constructor() {
            }

            warn(msg) {
                return msg;
            }
        }
        let logger = new Logger();

        beforeEach(() => {
            window.nodeConfig = {isClientPerfTrackingEnabled: false};
            window.EPISODES = mockEPISODES;

            Logger.__Rewire__('LogService', mockLogService);
            spyOn(logger, 'warn');

            spyOn(mockEPISODES, 'mark').and.callThrough();
            spyOn(mockEPISODES, 'measure').and.callThrough();
            spyOn(mockEPISODES, 'sendBeacon').and.callThrough();
            spyOn(mockEPISODES, 'done').and.callThrough();

        });

        afterEach(() => {
            Logger.__ResetDependency__('LogService');
            logger.warn.calls.reset();
            mockEPISODES.mark.calls.reset();
            mockEPISODES.measure.calls.reset();
            mockEPISODES.sendBeacon.calls.reset();
            mockEPISODES.done.calls.reset();
        });

        it('test isEnabled function', () => {
            expect(PerfLogUtils.isEnabled).toBeTruthy();
            expect(PerfLogUtils.isEnabled()).toBeFalsy();
        });
        it('test mark function', () => {
            expect(PerfLogUtils.mark).toBeTruthy();
            PerfLogUtils.mark();
            expect(mockEPISODES.mark).not.toHaveBeenCalled();
        });
        it('test mark with data function', () => {
            expect(PerfLogUtils.mark).toBeTruthy();
            PerfLogUtils.mark('test');
            expect(mockEPISODES.mark).not.toHaveBeenCalledWith('test', undefined);
        });
        it('test measure function', () => {
            expect(PerfLogUtils.measure).toBeTruthy();
            PerfLogUtils.measure();
            expect(mockEPISODES.measure).not.toHaveBeenCalled();
        });
        it('test send function', () => {
            expect(PerfLogUtils.send).toBeTruthy();
            PerfLogUtils.send();
            expect(mockEPISODES.sendBeacon).not.toHaveBeenCalled();
        });
        it('test send function with data', () => {
            expect(PerfLogUtils.send).toBeTruthy();
            var param = {this: 'too'};
            PerfLogUtils.send(param);
            expect(mockEPISODES.sendBeacon).not.toHaveBeenCalled();
        });
        it('test done function', () => {
            expect(PerfLogUtils.done).toBeTruthy();
            PerfLogUtils.done();
            expect(mockEPISODES.done).not.toHaveBeenCalled();
        });
        it('test done function with callback', () => {
            expect(PerfLogUtils.send).toBeTruthy();
            var callback = () => {
            };
            PerfLogUtils.done(callback);
            expect(mockEPISODES.done).not.toHaveBeenCalled();
        });
        it('test setLogger function', () => {
            expect(PerfLogUtils.setLogger).toBeTruthy();
            PerfLogUtils.setLogger(logger);
            let theMsg = 'helloFromLogger';
            mockEPISODES.dprint(theMsg);
            expect(logger.warn).not.toHaveBeenCalled();
            expect(logger.warn).not.toHaveBeenCalledWith(theMsg);
        });

    });
});
