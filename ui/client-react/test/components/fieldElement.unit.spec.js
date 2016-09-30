import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import FieldElement from '../../src/components/QBForm/fieldElement';
import FieldLabelElement from '../../src/components/QBForm/fieldLabelElement';
import FieldValueRenderer from '../../src/components/fields/fieldValueRenderer';
import FieldValueEditor from '../../src/components/fields/fieldValueEditor';

let flux = {
    actions: {
        recordPendingValidateField: ()=> {
        }
    }
};

let relatedField = {
    id: 6,
    name: "field",
    datatypeAttributes: {
        type: "TEXT"
    }
};
let fieldRecord = {
    display: "display",
    value: "value",
    id: 6
};
let element = {
    fieldId: 6,
    type: "FIELD"
};
describe('FieldElement functions', () => {
    'use strict';

    let component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<FieldElement flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const field = ReactDOM.findDOMNode(component);
        expect(field).toBeDefined();
    });

    it('test render of editor components', () =>{
        component = TestUtils.renderIntoDocument(<FieldElement flux={flux} element={element} fieldRecord={fieldRecord} edit={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.scryRenderedComponentsWithType(component, FieldValueEditor).length).toEqual(1);
    });

    it('test render of view components', () =>{
        component = TestUtils.renderIntoDocument(<FieldElement flux={flux} element={element} fieldRecord={fieldRecord} edit={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.scryRenderedComponentsWithType(component, FieldValueRenderer).length).toEqual(1);
    });

    it('test render of labels', () =>{
        component = TestUtils.renderIntoDocument(<FieldElement flux={flux} element={element} fieldRecord={fieldRecord} relatedField={relatedField} edit={false} includeLabel={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.scryRenderedComponentsWithType(component, FieldLabelElement).length).toEqual(1);
    });

    it('test onChange for edit component', () =>{
        spyOn(flux.actions, 'recordPendingValidateField');
        var callbacks = {
            onChange : function onChange(val) {},
            onBlur : function onBlur(val) {}
        };
        var TestParent = React.createFactory(React.createClass({
            getInitialState() {
                return {
                    value: "old"
                };
            },
            onChange(val) {
                this.setState({value: val});
            },
            onBlur(val) {
                this.setState({value: val});
            },
            render() {
                return <FieldElement ref="fieldElement" flux={flux} element={element} fieldRecord={{value: this.state.value, display: this.state.value}} relatedField={relatedField}
                                     edit={true} onChange={this.onChange} onBlur={this.onBlur} />;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        component = TestUtils.scryRenderedComponentsWithType(parent.refs.fieldElement, FieldElement)[0];

        let expectedCallBackArgs = {
            values: {
                oldVal: {value: "old", display: "old"},
                newVal: {value: "old", display: "new"}
            },
            fid: 6,
            fieldName: "field"
        };

        let input = TestUtils.scryRenderedDOMComponentsWithClass(component, "input");
        input[0].value = "new";

        TestUtils.Simulate.change(input[0]);
        expect(parent.state.value).toEqual(expectedCallBackArgs);

    });

    it('test onBlur for edit component', () =>{
        spyOn(flux.actions, 'recordPendingValidateField');
        var callbacks = {
            onChange : function onChange(val) {},
            onBlur : function onBlur(val) {}
        };
        var TestParent = React.createFactory(React.createClass({
            getInitialState() {
                return {
                    value: "old"
                };
            },
            onChange(val) {
                this.setState({value: val});
            },
            onBlur(val) {
                this.setState({value: val});
            },
            render() {
                return <FieldElement ref="fieldElement" flux={flux} element={element} fieldRecord={{value: this.state.value, display: this.state.value}} relatedField={relatedField}
                                     edit={true} onChange={this.onChange} onBlur={this.onBlur} />;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        component = TestUtils.scryRenderedComponentsWithType(parent.refs.fieldElement, FieldElement)[0];

        let expectedCallBackArgs = {
            values: {
                oldVal: {value: "old", display: "old"},
                newVal: {value: "new", display: "new"}
            },
            fid: 6,
            fieldName: "field"
        };

        let input = TestUtils.scryRenderedDOMComponentsWithClass(component, "input");
        input[0].value = "new";

        TestUtils.Simulate.blur(input[0]);
        expect(parent.state.value).toEqual(expectedCallBackArgs);
        expect(flux.actions.recordPendingValidateField).toHaveBeenCalledWith(relatedField, "field", "new");
    });
});
