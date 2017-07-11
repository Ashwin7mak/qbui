export const VALID_HEX_VALUE = /^#[0-9a-f]{6}$/i;
export const VALID_HEX_CHARACTERS = /^[#0-9a-f]*$/i;

/**
 * Determines if a passed in string is a valid hex color.
 * @param color
 */
export const isValidHexColor = color => VALID_HEX_VALUE.test(color);

/**
 * Removes extra # signs from a string to help format the hex color string.
 * Makes sure a # sign is always at the front of the color string.
 * @param color
 */
export const formatHexColor = color => typeof color === 'string' ? `#${color.replace(/#/g, '')}` : '#';
