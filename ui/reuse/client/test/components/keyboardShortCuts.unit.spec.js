import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import KeyboardShortCuts, {__RewireAPI__ as KeyboardShortCutsRewireAPI} from '../../src/components/keyboardShortcuts/keyboardShortcuts';

/**
 * This lets us mock out and test library classes
 * for more info see http://stackoverflow.com/questions/25688880/spy-on-a-constructor-using-jasmine
 * */
let mockClass = function(Subject) {
    var Surrogate = function() {
        Surrogate.prototype.constructor.apply(this, arguments);
        return Surrogate.prototype;
    };
    Surrogate.prototype = Object.create(Subject.prototype);
    Surrogate.prototype.constructor = Subject;
    return Surrogate;
};

let MouseTrap = (_selector) => {};

MouseTrap.prototype = {
    bind() {}
};

let MockMouseTrap = mockClass(MouseTrap);

const keyBindings = [{key: 'esc', callback: () => {}}, {key: 'mod+s', callback: () => {}}];
const testId = "testId";

let component;

describe('KeyboardShortCuts', () => {
    beforeEach(() => {
        jasmineEnzyme();
        KeyboardShortCutsRewireAPI.__Rewire__('MouseTrap', MockMouseTrap);
        spyOn(MockMouseTrap.prototype, 'constructor').and.callThrough();
        spyOn(MockMouseTrap.prototype, 'bind');

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
        expect(MockMouseTrap.prototype.constructor).toHaveBeenCalledWith(document.body);
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
