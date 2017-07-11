import React, {PropTypes, Component} from 'react';
import {CirclePicker} from 'react-color';
import {AVAILABLE_ICON_FONTS} from '../icon/icon';
import SimpleInput from '../simpleInput/simpleInput';
import IconAndColorPreview from '../iconAndColorPreview/iconAndColorPreview';
import {isValidHexColor, formatHexColor, VALID_HEX_CHARACTERS} from '../../utils/colorValidator';
import includes from 'lodash/includes';

import './colorPicker.scss';

export const DEFAULT_COLOR_LIST = [
    '#74489d', // default purple
    '#005773',
    '#3e7a00',
    '#bb5d00',
    '#8b1100',
    '#82004b',
    '#987300',
    '#3e4245',
    '#000000'
];

export const COLOR_TYPES = {
    DEFAULT: 'hex',
    HEX: 'hex',
    HSL: 'hsl',
    RGB: 'rgb',
    ALL: 'all'
};

// Used when the currently selected value is an invalid hex color.
// Prevents ReactColor (CirclePicker) from blowing up while a custom color is being entered.
export const FALLBACK_COLOR = '#ffffff';

/**
 * A color picker for choosing a color (e.g., choosing an app color).
 */
class ColorPicker extends Component {
    static propTypes = {
        /**
         * The currently selected hex value color. The React-Color component will also accept rgb or hsl objects.
         * But the current implementation on the UI is hex values.
         * Using hsl or rgb objects may break some features of this component. Using hsl or rgb is called out here
         * because it is available as part of ReactColor, but may require this implementation to be extended. */
        value: PropTypes.string,

        /**
         * Callback that is fired when a new color is selected.
         * It receives one argument, the color that was selected (as a hex value by default) */
        onChange: PropTypes.func,

        /**
         * The width of the component in pixels so you can size it to your needs. */
        width: PropTypes.number,

        /**
         * Indicates whether or not to display the custom color picker. */
        hasCustomColor: PropTypes.bool,

        /**
         * Shows a large circle above the color picker that displays the current value. */
        isPreviewVisible: PropTypes.bool,

        /**
         * Optionally, display an icon inside of the preview. */
        icon: PropTypes.string,
        iconFont: PropTypes.string,
        iconColor: PropTypes.string,

        // -----------------
        // Below are props you probably shouldn't change to much if working in the qbui project,
        // but are provided in case additional customization is needed for your instance of the color picker.

        /**
         * An array of hex values. These will be the color choices used by the component.
         * There is already a recommended default. Only override if needed.
         * The XD recommendation is to have 9 colors, with a 10th space set aside for the custom color. */
        colors: PropTypes.arrayOf(PropTypes.string),

        /**
         * The type of color value that should be returned during an onChange.
         * You probably shouldn't change this from the default value of `hex` if using within the qbui project.
         * Additionally, changing this from hex may break the preview or custom color. It is best to turn those off if not using hex as the value.
         * Can be 'hex', 'rgb', 'hsl', or 'all'. 'all' returns the default object from React-Color.
         * You can import the COLOR_TYPES to use as constants to change this value. */
        colorType: PropTypes.oneOf(['hex', 'rgb', 'hsl', 'all']), // Listed here as strings so that intellij can pick up on the values

        /**
         * The size of the color swatch circles */
        circleSize: PropTypes.number,

        /**
         * The distance between the color swatch circles */
        circleSpacing: PropTypes.number,
    };

    static defaultProps = {
        isPreviewVisible: false,
        colors: DEFAULT_COLOR_LIST,
        colorType: COLOR_TYPES.DEFAULT,
        iconFont: AVAILABLE_ICON_FONTS.DEFAULT,
        iconColor: '#ffffff',
        width: 210,
        circleSpacing: 10
    };

    /**
     * Helper function to return the color as specified by the colorType prop.
     * @param color
     * @returns {*}
     * @private
     */
    _getCurrentColor = (color) => {
        return this.props.colorType === 'all' ? color : color[this.props.colorType];
    };

    /**
     * When a color is selected, it calls the onChange event and passes up the color.
     * The value is a hex value by default. Modify the `colorType` prop to pass different types of color values.
     * @param color
     * @param event
     */
    onChange = (color, event) => {
        if (this.props.onChange) {
            return this.props.onChange(this._getCurrentColor(color));
        }
    };

    /**
     * When the custom color input box is changed, still fire the onChange event and pass up the current color.
     * This also makes sure that there is always a '#' in the input field.
     * @param value
     */
    onChangeCustomColor = value => {
        if (this.props.onChange) {
            // Strips out any # characters and makes sure it is always added as the first character of the string
            const formattedValue = formatHexColor(value);

            return this.props.onChange(formattedValue);
        }
    };

    /**
     * Returns the list of colors.
     * If there is a custom color, it adds it to the colors array.
     */
    getColorList = () => {
        const {value, colors} = this.props;
        const formattedValue = formatHexColor(value);

        // When the value is blank, wipe out the custom color.
        // Otherwise, add valid hex values as a custom color if not in the list of colors.
        if (formattedValue === '#') {
            return colors;
        }

        if (isValidHexColor(formattedValue) && !includes(colors, formattedValue)) {
            return [...colors, formattedValue];
        }

        return colors;
    };

    /**
     * Use the current value if it is valid, otherwise, blank it out with white.
     * This keeps the CirclePicker from blowing up if the custom color is currently invalid.
     * @returns {string}
     */
    formatColorValue = () => {
        return isValidHexColor(this.props.value) ? this.props.value : FALLBACK_COLOR;
    };

    render() {
        const {icon, iconColor, iconFont, value, width, circleSpacing, circleSize} = this.props;

        return (
            <div className="colorPicker">
                {this.props.isPreviewVisible &&
                    <IconAndColorPreview
                        icon={icon}
                        iconFont={iconFont}
                        iconColor={iconColor}
                        backgroundColor={value}
                    />
                }

                <CirclePicker
                    color={this.formatColorValue()}
                    colors={this.getColorList()}
                    onChangeComplete={this.onChange}
                    width={width}
                    circleSize={circleSize}
                    circleSpacing={circleSpacing}
                />

                {this.props.hasCustomColor &&
                    <SimpleInput
                        className="customColorPickerText"
                        value={value}
                        onChange={this.onChangeCustomColor}
                        maxLength={7}
                        mask={VALID_HEX_CHARACTERS}
                    />
                }
            </div>
        );
    }
}

export default ColorPicker;
