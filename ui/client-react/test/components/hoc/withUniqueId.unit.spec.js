import React from 'react';
import {mount, shallow} from 'enzyme';

import withUniqueId from '../../../src/components/hoc/withUniqueId';

describe('withUniqueId HOC', () => {
    let component;

    class mockComponentClass extends React.Component {
        render() {
            return <div className="mock" />;
        }
    }

    it('generates uniqueId', () => {
        // wrap the mock class with HOC
        const MockClassWithId = withUniqueId(mockComponentClass);

        const component1 = mount(<MockClassWithId />);
        const component2 = mount(<MockClassWithId />);

        expect(component1.instance().uniqueId).not.toEqual(component2.instance().uniqueId);
    });

    it('passes unique ID to wrapped component', () => {
        // wrap the mock class with HOC
        const MockClassWithId = withUniqueId(mockComponentClass);

        component = mount(<MockClassWithId />);

        const HOCUniqueId = component.instance().uniqueId;
        const innerComponentUniqueId = component.find(mockComponentClass).prop('uniqueId');
        expect(HOCUniqueId).toEqual(innerComponentUniqueId);
    });

    it('generates unique ID using passed in props.context', () => {
        // wrap the mock class with HOC, pass in context to append uniqueID
        // might as well use everyone's favorite and ever ellusive javascript context, 'this'
        const context = 'THIS';
        const MockClassWithId = withUniqueId(mockComponentClass, context);
        component = mount(<MockClassWithId />);

        const HOCUniqueId = component.instance().uniqueId;
        const innerComponentUniqueId = component.find(mockComponentClass).prop('uniqueId');
        expect(component.instance().uniqueId.indexOf(context) > -1).toBeTruthy();
    });
});
