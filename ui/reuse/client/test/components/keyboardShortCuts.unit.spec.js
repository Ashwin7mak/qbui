import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import KeyboardShortCuts, {__RewireAPI__ as KeyboardShortCutsRewireAPI} from '../../src/components/keyboardShortcuts/keyboardShortcuts';

let MockMouseTrap = {
    bind: (_keyBindings) => {},
    bindGlobal: (_keyBindings) => {}
};

const keyBindings = [{key: 'esc', callback: () => {}}];
const testId = "testId";

let component;

describe('KeyboardShortCuts', () => {
    beforeEach(() => {
        jasmineEnzyme();
        spyOn(MockMouseTrap, 'bindGlobal').and.callThrough();
        spyOn(MockMouseTrap, 'bind');
        KeyboardShortCutsRewireAPI.__Rewire__('Mousetrap', MockMouseTrap);

    });

    afterEach(() => {
        KeyboardShortCutsRewireAPI.__ResetDependency__('MouseTrap');
    });

    it('calls addAllKeyBindings when component mounts ', () => {
        component = shallow(<KeyboardShortCuts
            shortcutBindings={keyBindings}
            id={testId}
        />);

        let instance = component.instance();

        instance.componentWillMount();

        expect(instance.addAllKeyBindings).toHaveBeenCalledWith(keyBindings);
        expect(MockMouseTrap.bind).toHaveBeenCalledWith([keyBindings[0].key, keyBindings[0].callback], [keyBindings[1].key, keyBindings[1].callback]);
    });

    fit('calls addAllKeyBindingsPreventDefault when component mounts ', () => {
        component = shallow(<KeyboardShortCuts
            shortcutBindingsPreventDefault={keyBindings}
            id={testId}
        />);

        let instance = component.instance();
        spyOn(instance, 'addAllKeyBindingsPreventDefault');
        instance.componentWillMount();

        expect(instance.addAllKeyBindingsPreventDefault).toHaveBeenCalledWith(keyBindings);
        expect(MockMouseTrap.bindGlobal).toHaveBeenCalled();
    });

    it('calls removeAllKeyBindings when component unmounts', () => {
        component = shallow(<KeyboardShortCuts
            shortcutBindings={keyBindings}
            shortcutBindingsPreventDefault={keyBindings}
            id={testId}
        />);

        let instance = component.instance();
        spyOn(instance, 'removeAllKeyBindings');
        instance.componentWillUnmount();

        expect(instance.removeAllKeyBindings.calls.count()).toBe(1);
    });
});
