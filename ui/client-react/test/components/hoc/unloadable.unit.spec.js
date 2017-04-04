import React from 'react';
import {mount, shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import promise from 'bluebird';

import unloadable from '../../../src/components/hoc/unloadable';

describe('unloadable HOC', () => {
    let component;
    let uniqueId = 'uniqueId';

    const newProps = () => ({
        hasEntry: false,
        uniqueId,
        loadEntry() {},
        unloadEntry() {}
    });
    let props;
    let propsNoEntry;

    class mockComponentClass extends React.Component {
        render() {
            return <div className="mock" />;
        }
    }
    // wrap the mock class with HOC
    const MockUnloadableComponent = unloadable(mockComponentClass);

    beforeAll(() => {
        jasmineEnzyme();
    });

    beforeEach(() => {
        // create new copy of props for each test
        props = newProps();
        propsNoEntry = Object.assign({}, newProps(), {hasEntry: true});
    });

    it('renders wrapped component when entry exists', () => {
        component = mount(<MockUnloadableComponent {...propsNoEntry} />);

        expect(component.find('.mock').length).toEqual(1);
    });

    it('does not render wrapped component if no entry exists', () => {
        component = mount(<MockUnloadableComponent {...props} />);

        expect(component.find('.mock').length).toEqual(0);
    });

    it('calls loadEntry when component mounts if no entry exists', () => {
        spyOn(props, 'loadEntry');

        component = mount(<MockUnloadableComponent {...props} />);

        expect(props.loadEntry).toHaveBeenCalledWith(uniqueId);
    });

    it('does not call loadEntry when a component mounts, if no entry exists', () => {
        spyOn(props, 'loadEntry');

        component = mount(<MockUnloadableComponent {...propsNoEntry} />);

        expect(props.loadEntry).not.toHaveBeenCalled();
    });

    it('calls unloadEntry when component unmounts', () => {
        spyOn(props, 'unloadEntry');

        component = mount(<MockUnloadableComponent {...props} />);
        component.unmount();

        expect(props.unloadEntry).toHaveBeenCalledWith(uniqueId);
    });
});
