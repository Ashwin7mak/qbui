import React, {Component} from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {CirclePicker} from 'react-color';
import SimpleInput from '../../src/components/simpleInput/simpleInput';

import ColorPicker, {FALLBACK_COLOR, DEFAULT_COLOR_LIST, COLOR_TYPES} from '../../src/components/colorPicker/colorPicker';

let component;

const getReactColorPicker = () => component.find(CirclePicker);
const getCustomColorPickerInput = () => component.find(SimpleInput);
const getIconAndColorPreview = () => component.find('IconAndColorPreview');

const validHexColor = DEFAULT_COLOR_LIST[0];
const invalidHexColor = '#yyy';
const mockReactColorResponse = {
    hex: validHexColor,
    hsl: {h: 271.05882352941177, s: 0.3711790393013101, l: 0.44901960784313727, a:1},
    rgb: {r: 116, g: 72, b: 157, a: 1}
};

class MockParentWithState extends Component {
    constructor(props) {
        super(props);

        this.state = {color: ''};
    }

    onChange = color => {
        this.setState({color});
    };

    render() {
        return <ColorPicker onChange={this.onChange} value={this.state.color} hasCustomColor={true} />;
    }
}

describe('ColorPicker', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    describe('value', () => {
        it('has a value that is the currently selected color', () => {
            component = shallow(<ColorPicker value={validHexColor} />);

            expect(getReactColorPicker()).toHaveProp('color', validHexColor);
        });

        it('passes a default color to the ReactColor picker if the current value is invalid', () => {
            component = shallow(<ColorPicker value={invalidHexColor} />);

            expect(getReactColorPicker()).toHaveProp('color', FALLBACK_COLOR);
        });
    });

    describe('width', () => {
        it('changes the width of the color picker', () => {
            const testWidth = 20;
            component = shallow(<ColorPicker width={testWidth} />);

            expect(getReactColorPicker()).toHaveProp('width', testWidth);
        });
    });

    describe('hasCustomColor', () => {
        it('displays the custom color picker if true', () => {
            component = shallow(<ColorPicker hasCustomColor={true} />);

            expect(getCustomColorPickerInput()).toBePresent();
        });

        it('hides the custom color picker if false', () => {
            component = shallow(<ColorPicker hasCustomColor={false} />);

            expect(getCustomColorPickerInput()).not.toBePresent();
        });
    });

    describe('onChange', () => {
        /**
         * There is not a sane way to activate the onChange complete test outside of this third party component;
         * therefore, we make sure the local instance was passed to the third party component and then test
         * the onChange function directly.
         */
        it('calls onChange when a new color is selected from the list of colors', () => {
            component = shallow(<ColorPicker />);

            expect(getReactColorPicker()).toHaveProp('onChangeComplete', component.instance().onChange);
        });

        describe('passes the color back in a format described by the colorType props', () => {
            let testCases = [
                {
                    description: 'returns the hex value by default',
                    colorType: COLOR_TYPES.DEFAULT,
                    expectedArgument: validHexColor
                },
                {
                    description: 'returns the hex value',
                    colorType: COLOR_TYPES.HEX,
                    expectedArgument: validHexColor
                },
                {
                    description: 'returns the hsl value',
                    colorType: COLOR_TYPES.HSL,
                    expectedArgument: mockReactColorResponse.hsl
                },
                {
                    description: 'returns the rgb value',
                    colorType: COLOR_TYPES.RGB,
                    expectedArgument: mockReactColorResponse.rgb
                },
                {
                    description: 'returns the whole color object',
                    colorType: COLOR_TYPES.ALL,
                    expectedArgument: mockReactColorResponse
                }
            ];

            testCases.forEach(testCase => {
                it(testCase.description, () => {
                    const testOnChange = jasmine.createSpy('testOnChange');
                    component = shallow(<ColorPicker onChange={testOnChange} colorType={testCase.colorType} />);

                    component.instance().onChange(mockReactColorResponse);

                    expect(testOnChange).toHaveBeenCalledWith(testCase.expectedArgument);
                });
            });
        });

        describe('change custom color input text', () => {
            const colorNotInColorList = '#fff123';

            let changeCustomColorInputTestCases = [
                {
                    description: 'adds the custom color to the list of swatches when a valid color is entered into the custom color picker',
                    inputText: colorNotInColorList,
                    expectedColors: [...DEFAULT_COLOR_LIST, colorNotInColorList],
                    expectedInputValue: colorNotInColorList
                },
                {
                    description: 'does not add the custom color to the list of swatches if an invalid color is entered into the custom color picker',
                    inputText: invalidHexColor,
                    expectedColors: DEFAULT_COLOR_LIST,
                    expectedInputValue: invalidHexColor
                },
                {
                    description: 'does not add a custom color that is already in the color list',
                    inputText: '#74489d',
                    expectedColors: DEFAULT_COLOR_LIST,
                    expectedInputValue: '#74489d'
                },
                {
                    description: 'does not add a custom color for a valid 3 digit hex value because React-Color does not support it',
                    inputText: '#123',
                    expectedColors: DEFAULT_COLOR_LIST,
                    expectedInputValue: '#123'
                },
                {
                    description: 'removes extra # from the user entered custom color',
                    inputText: '##111111',
                    expectedColors: [...DEFAULT_COLOR_LIST, '#111111'],
                    expectedInputValue: '#111111'
                },
                {
                    description: 'does not allow a user to delete the first # from the input',
                    inputText: '',
                    expectedColors: DEFAULT_COLOR_LIST,
                    expectedInputValue: '#'
                }
            ];

            changeCustomColorInputTestCases.forEach(testCase => {
                it(testCase.description, () => {
                    const parent = shallow(<MockParentWithState/>);
                    component = parent.find(ColorPicker).dive();

                    getCustomColorPickerInput().simulate('change', testCase.inputText);

                    // Need to re-dive to get the updated component
                    component = parent.find(ColorPicker).dive();
                    // For some reason I don't understand, using .toHaveProp modifies the DEFAULT_COLOR_LIST
                    // which breaks subsequent tests. Using .props().colors does not modify DEFAULT_COLOR_LIST so using that for now.
                    expect(getReactColorPicker().props().colors).toEqual(testCase.expectedColors);
                    expect(getCustomColorPickerInput()).toHaveProp('value', testCase.expectedInputValue);
                });
            });
        });
    });

    describe('isPreviewVisible', () => {
        it('shows the icon and color preview', () => {
            component = shallow(<ColorPicker isPreviewVisible={true} />);

            expect(getIconAndColorPreview()).toBePresent();
        });

        it('hides the icon and color preview', () => {
            component = shallow(<ColorPicker isPreviewVisible={false} />);

            expect(getIconAndColorPreview()).not.toBePresent();
        });

        it('has the correct icon and color displayed in the preview', () => {
            component = shallow(<ColorPicker
                isPreviewVisible={true}
                icon="favicon"
                iconFont="defaultFont"
                iconColor="#000000"
                value="#ffffff"
            />);

            const iconColorPreview = getIconAndColorPreview();
            expect(iconColorPreview).toHaveProp('icon', 'favicon');
            expect(iconColorPreview).toHaveProp('iconFont', 'defaultFont');
            expect(iconColorPreview).toHaveProp('iconColor', '#000000');
            expect(iconColorPreview).toHaveProp('backgroundColor', '#ffffff');
        });
    });

    describe('circleSize', () => {
        it('changes the size of the circle color swatches', () => {
            component = shallow(<ColorPicker circleSize={200} />);

            expect(getReactColorPicker()).toHaveProp('circleSize', 200);
        });
    });

    describe('circleSpacing', () => {
        it('changes the spacing between the circle color swatches', () => {
            component = shallow(<ColorPicker circleSpacing={150} />);

            expect(getReactColorPicker()).toHaveProp('circleSpacing', 150);
        });
    });
});



