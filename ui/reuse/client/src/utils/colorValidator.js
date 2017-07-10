export const VALID_HEX_VALUE = /^#[0-9a-f]{6}$/i;
export const VALID_HEX_CHARACTERS = /^[#0-9a-f]*$/i;

export const isValidHexColor = color => VALID_HEX_VALUE.test(color);
