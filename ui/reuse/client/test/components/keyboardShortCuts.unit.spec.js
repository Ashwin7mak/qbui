import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import KeyboardShortCuts, {__RewireAPI__ as KeyboardShortCutsRewireAPI} from 'REUSE/components/keyboardShortcuts/keyboardShortcuts';

let MockMouseTrap = {
    bind: (_keyBindings) => {},
    bindGlobal: (_keyBindings) => {},
    unbind: () => {}
};

const keyBindings = [{key: 'esc', callback: () => {}}, {key: 'mod+s', callback: () => {}}];
const testId = "testId";

let component;

describe('KeyboardShortCuts', () => {
    beforeEach(() => {
        jasmineEnzyme();
        KeyboardShortCutsRewireAPI.__Rewire__('Mousetrap', MockMouseTrap);
        spyOn(MockMouseTrap, 'bindGlobal');
        spyOn(MockMouseTrap, 'bind');
        spyOn(MockMouseTrap, 'unbind');

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
        spyOn(instance, 'addAllKeyBindings');
        instance.componentWillMount();

        expect(instance.addAllKeyBindings).toHaveBeenCalledWith(keyBindings);
        expect(MockMouseTrap.bind).toHaveBeenCalled();
    });

    it('calls addAllKeyBindingsPreventDefault when component mounts ', () => {
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
        spyOn(instance, 'removeAllKeyBindings').and.callThrough();
        instance.componentWillUnmount();

        expect(instance.removeAllKeyBindings).toHaveBeenCalled();
        expect(MockMouseTrap.unbind).toHaveBeenCalled();
    });
});
