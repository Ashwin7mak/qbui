import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import CellRenderers from '../../src/components/dataTable/agGrid/cellRenderers';

import {DateCellRenderer, DateTimeCellRenderer, TimeCellRenderer, NumericCellRenderer, TextCellRenderer, CheckBoxCellRenderer} from '../../src/components/dataTable/agGrid/cellRenderers';
import {__RewireAPI__ as NumberFieldValueRendererRewire}  from '../../src/components/fields/fieldValueRenderers';
import consts from '../../../common/src/constants';

describe('AGGrid cell editor functions', () => {
    'use strict';

    let component;

    var I18nMessageMock = React.createClass({
        render: function() {
            return <span>{this.props.value}</span>;
        }
    });

    beforeEach(() => {

        CellRenderers.__Rewire__('I18nDate', I18nMessageMock);
        CellRenderers.__Rewire__('I18nNumber', I18nMessageMock);
        NumberFieldValueRendererRewire.__Rewire__('I18nNumber', I18nMessageMock);
    });

    afterEach(() => {

        CellRenderers.__ResetDependency__('I18nDate');
        CellRenderers.__ResetDependency__('I18nNumber');
        NumberFieldValueRendererRewire.__ResetDependency__('I18nNumber');
    });

    it('test TextCellRenderer scalar', () => {
        const params = {
            value: {
                value: "TestingTextCell",
                display: "TestingTextCell"
            },
            column: {
                colDef: {fieldDef: {
                    type : consts.SCALAR
                }}
            }
        };

        component = TestUtils.renderIntoDocument(<TextCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const value = TestUtils.findRenderedDOMComponentWithClass(component, "cellData");
        expect(value.innerText).toEqual(params.value.display);
        expect(value.querySelectorAll('.textField').length).toEqual(1);


        const edit = TestUtils.findRenderedDOMComponentWithClass(component, "cellEdit");
        expect(edit.type).toEqual("text");
        expect(edit.value).toEqual(params.value.display);

        edit.value = "newValue";
        TestUtils.Simulate.change(edit);
        expect(value.innerText).toEqual("newValue");
    });

    it('test TextCellRenderer multiline', () => {
        const params = {
            value: {
                value: "Testing",
                display: "Testing"
            },
            column: {
                colDef: {
                    fieldDef: {
                        type: consts.SCALAR,
                        datatypeAttributes: {
                            clientSideAttributes: {
                                num_lines: 4
                            }
                        }
                    }
                }
            }
        };

        component = TestUtils.renderIntoDocument(<TextCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const value = TestUtils.findRenderedDOMComponentWithClass(component, "multiLineTextCell");
        expect(value.innerHTML).toEqual(params.value.display);

        const edit = TestUtils.findRenderedDOMComponentWithClass(component, "cellEdit");
        expect(edit.type).toEqual("textarea");
        expect(edit.value).toEqual(params.value.display);

        edit.value = "newValue";
        TestUtils.Simulate.change(edit);
        expect(value.innerHTML).toEqual("newValue");
    });

    it('test TextCellRenderer colDef type undefined should default to editable', () => {
        const params = {
            value: {
                value: "TestingTextCell",
                display: "TestingTextCell"
            },
            column: {
                colDef: {
                    fieldDef : {

                    }
                }
            }
        };

        component = TestUtils.renderIntoDocument(<TextCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const value = TestUtils.findRenderedDOMComponentWithClass(component, "cellData");
        expect(value.innerText).toEqual(params.value.display);
        expect(value.querySelectorAll('.textField').length).toEqual(1);


        const edit = TestUtils.findRenderedDOMComponentWithClass(component, "cellEdit");
        expect(edit.type).toEqual("text");
        expect(edit.value).toEqual(params.value.display);

        edit.value = "newValue";
        TestUtils.Simulate.change(edit);
        expect(value.innerText).toEqual("newValue");
    });

    it('test TextCellRenderer Non SCALAR should not allow editing', () => {
        const params = {
            value: {
                value: "TestingTextCell",
                display: "TestingTextCell"
            },
            column: {
                colDef: {
                    fieldType : consts.FORMULA,
                }
            }
        };

        component = TestUtils.renderIntoDocument(<TextCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const value = TestUtils.findRenderedDOMComponentWithClass(component, "cellData");
        expect(value.innerText).toEqual(params.value.display);
        expect(value.querySelectorAll('.textField').length).toEqual(1);


        const edit = TestUtils.scryRenderedDOMComponentsWithClass(component, "cellEdit");
        expect(edit.length).toEqual(0);
    });

    it('test NumericCellRenderer', () => {
        const params = {
            value: {
                value: 123,
                display: "123"
            },
            column: {
                colDef: {
                    fieldDef: {
                        type : consts.SCALAR,
                        datatypeAttributes: {
                            type: "NUMERIC"
                        }
                    },
                }
            }
        };

        component = TestUtils.renderIntoDocument(<NumericCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const valueElements = ReactDOM.findDOMNode(component).querySelectorAll("div.numericField");
        expect(valueElements.length).toBe(1);

        expect(valueElements[0].innerHTML).toEqual(params.value.display);

        const edit = TestUtils.findRenderedDOMComponentWithClass(component, "cellEdit");
        expect(edit.type).toEqual("text");

        edit.value = 456;
        TestUtils.Simulate.change(edit);
        expect(valueElements[0].innerHTML).toEqual("456");
    });

    it('test CheckBoxCellRenderer', () => {
        const params = {
            value: {
                value: true
            },
            column: {
                colDef: {
                    fieldDef: {
                        type: consts.SCALAR
                    }
                }
            }
        };

        component = TestUtils.renderIntoDocument(<CheckBoxCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const checkbox = ReactDOM.findDOMNode(component).querySelectorAll(".cellData .checkbox");
        expect(checkbox.length).toEqual(1);
    });

    it('test DateCellRenderer edit', () => {
        const params = {
            value: {
                value: "2015-11-03"
            },
            column: {
                colDef: {
                    type : consts.SCALAR,
                    fieldDef: {
                        datatypeAttributes: {
                            dateFormat: "MM-dd-uuuu"
                        }
                    }
                }
            }
        };

        component = TestUtils.renderIntoDocument(<DateCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const valueElements = ReactDOM.findDOMNode(component).querySelectorAll(".cellData .dateCell");

        const editInputs = ReactDOM.findDOMNode(component).querySelectorAll(".cellEdit input");
        expect(editInputs.length).toEqual(1);
        expect(editInputs[0].value).toBe("11-03-2015");

        TestUtils.Simulate.change(editInputs[0], {"target": {"value": "03-04-2097"}});
        expect(editInputs[0].value).toBe("03-04-2097");

    });

    it('test DateTimeFormatter - change a date', () => {
        const params = {
            value: {
                value: "2015-09-03T09:33:03.777Z"
            },
            column: {
                colDef: {
                    type : consts.SCALAR,
                    fieldDef: {
                        datatypeAttributes: {
                            showTime: true,
                            dateFormat: "MM-DD-YYYY hh:mm:ss"
                        }
                    }
                }
            }
        };

        component = TestUtils.renderIntoDocument(<DateTimeCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        //  test date picker
        const dateEditInputs = ReactDOM.findDOMNode(component).querySelectorAll(".dateCell input");
        expect(dateEditInputs.length).toEqual(1);
        expect(dateEditInputs[0].value).toBe(`09-03-2015`);

        //  change a date
        TestUtils.Simulate.change(dateEditInputs[0], {"target": {"value":"10-15-2015"}});
        expect(dateEditInputs[0].value).toBe("10-15-2015");

        //  test time droplist
        const timeEditInputs = ReactDOM.findDOMNode(component).querySelectorAll(".timeCell input");
        expect(timeEditInputs.length).toEqual(2);
        expect(timeEditInputs[0].value).toBe("02:33");
    });

    it('test DateTimeFormatter edit - quickbase shortcuts', () => {
        const params = {
            value: {
                value: "2015-09-03T09:33:03.777Z"
            },
            column: {
                colDef: {
                    type : consts.SCALAR,
                    datatypeAttributes: {
                        showTime: true,
                        dateFormat: "MM-DD-YYYY hh:mm:ss"
                    }
                }
            }
        };
        var ASCII_LEFT_BRACKET = 91;
        var ASCII_RIGHT_BRACKET = 93;

        component = TestUtils.renderIntoDocument(<DateTimeCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        //  test date picker
        const dateEditInputs = ReactDOM.findDOMNode(component).querySelectorAll(".dateCell input");
        expect(dateEditInputs.length).toEqual(1);
        expect(dateEditInputs[0].value).toBe(`09-03-2015`);

        //  increment a date
        TestUtils.Simulate.keyPress(dateEditInputs[0], {"charCode": ASCII_RIGHT_BRACKET});
        expect(dateEditInputs[0].value).toBe("09-04-2015");

        //  decrement a date 2 days
        TestUtils.Simulate.keyPress(dateEditInputs[0], {"charCode": ASCII_LEFT_BRACKET});
        TestUtils.Simulate.keyPress(dateEditInputs[0], {"charCode": ASCII_LEFT_BRACKET});
        expect(dateEditInputs[0].value).toBe("09-02-2015");

        TestUtils.Simulate.blur(dateEditInputs[0], {"target": {value: "Jan 2015"}});
        expect(dateEditInputs[0].value).toBe("01-31-2015");

    });

    it('test DateTimeFormatter edit w/o time', () => {
        const params = {
            value: {
                value: "2015-09-03T09:33:03.777Z"
            },
            column: {
                colDef: {
                    fieldDef: {
                        datatypeAttributes: {
                            showTime: false,
                            dateFormat: "MM-DD-YYYY hh:mm:ss"
                        }
                    }
                }
            }
        };

        component = TestUtils.renderIntoDocument(<DateTimeCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        //  test date picker
        const dateEditInputs = ReactDOM.findDOMNode(component).querySelectorAll(".dateCell input");
        expect(dateEditInputs.length).toEqual(1);
        expect(dateEditInputs[0].value).toBe(`09-03-2015`);

        //  test time droplist doesn't render
        const timeEditInputs = ReactDOM.findDOMNode(component).querySelectorAll(".timeCell input");
        expect(timeEditInputs.length).toEqual(0);
    });

    it('test TimeFormatter', () => {
        const params = {
            value: {
                value: "1970-01-01T19:53:42.531Z[UTC]"
            },
            column: {
                colDef: {
                    fieldDef: {
                        type : consts.SCALAR,
                        datatypeAttributes: {
                            dateFormat: "MM-DD-YYYY",
                            showTime: true
                        }
                    }
                }
            }
        };

        component = TestUtils.renderIntoDocument(<TimeCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const editInputs = ReactDOM.findDOMNode(component).querySelectorAll(".cellEdit input");
        expect(editInputs.length).toEqual(2);
        expect(editInputs[0].value).toBe("19:53");
    });

    it('test DateFormatter', () => {
        const params = {
            value: {
                value: "2097-01-17"
            },
            column: {
                colDef: {
                    fieldDef: {
                        datatypeAttributes: {},
                        type: consts.SCALAR
                    }
                }
            }
        };

        component = TestUtils.renderIntoDocument(<DateCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test DateTimeFormatter', () => {
        const params = {
            value: {
                value: "2097-01-17T00:33:03Z"
            },
            column: {
                colDef: {
                    fieldDef: {
                        datatypeAttributes: {},
                        type: consts.SCALAR
                    }
                }
            }
        };

        component = TestUtils.renderIntoDocument(<DateTimeCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

    });

    it('test TimeFormatter', () => {
        const params = {
            value: {
                value: "1970-01-01T19:13:44Z"
            },
            column: {
                colDef: {
                    fieldDef: {
                        datatypeAttributes: {},
                        type: consts.SCALAR
                    }
                }
            }
        };

        component = TestUtils.renderIntoDocument(<TimeCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});
