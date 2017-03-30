import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import KeyboardShortCuts from '../../src/components/keyboardShortcuts/keyboardShortcuts';

const keyBindings = [{key: 'esc', callback: () => {}}, {key: 'mod+s', callback: () => {}}];
const testId = "testId";

let component;

describe('KeyboardShortCuts', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    afterEach(() => {
    });

    it('calls addAllKeyBindings when component mounts ', () => {
        component = shallow(<KeyboardShortCuts
            shortcutBindings={keyBindings}
            id={testId}
        />);

        let instance = component.instance();
        spyOn(instance, 'addAllKeyBindings');
        instance.componentWillMount();

        expect(instance.addAllKeyBindings).toHaveBeenCalledWith(keyBindings);
    });

    it('calls removeAllKeyBindings when component unmounts ', () => {
        component = shallow(<KeyboardShortCuts
            shortcutBindings={keyBindings}
            id={testId}
        />);

        let instance = component.instance();
        spyOn(instance, 'removeAllKeyBindings');
        instance.componentWillUnmount();

        expect(instance.removeAllKeyBindings.calls.count()).toBe(1);
    });
});
