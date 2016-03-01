import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FacetsAspect  from '../../src/components/facet/facetsAspect';


describe('FacetsAspect functions', () => {
    'use strict';

    var I18nMessageMock = React.createClass({
        render: function() {
            return (
                <div>test</div>
            );
        }
    });

    beforeEach(() => {
        FacetsAspect.__Rewire__('I18nMessage', I18nMessageMock);
    });

    afterEach(() => {
        FacetsAspect.__ResetDependency__('I18nMessage');
    });

    let component;
    let item = {
        id:22,
        name:"test",
        type:"TEXT",
        values:[{value:"a"}, {value:"b"}, {value:"c"}]
    };


    it('test render facetsAspect', () => {
        component = TestUtils.renderIntoDocument(<FacetsAspect facet={item}
                                                             item={item}
                                                             />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render facetsAspect as selected', () => {
        component = TestUtils.renderIntoDocument(<FacetsAspect facet={item}
                                                             item={item}
                                                             isSelected={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render facetsAspect as not selected', () => {
        component = TestUtils.renderIntoDocument(<FacetsAspect facet={item}
                                                             item={item}
                                                             isSelected={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render facetsAspect shouldComponentUpdate', () => {
        component = TestUtils.renderIntoDocument(<FacetsAspect facet={item}
                                                              item={item}
                                                              isSelected={false}/>);
        // no change
        expect(component.shouldComponentUpdate(component.props, component.state)).toBeFalsy();

        // change select prop
        let nextProps = _.clone(component.props, true);
        nextProps.isSelected = true;
        expect(component.shouldComponentUpdate(nextProps, component.state)).toBeTruthy();

    });

});

