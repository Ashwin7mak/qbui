/**
 * TAB FLOW FOR FORMBUILDER:
 * It is best to use only tabIndex="0" to make an element tab able and tabIndex="-1" to remove it from the tab flow. By using "0" the dom will order the tab flow according
 * to the way the dom nodes are laid out on the dom. This usually places everything in a logically order.
 *
 * However, in the event that the tab flow is not rendered in the desired order on the dom, then tabIndex can be ordered numerically as captured in the constants below.
 * In the instance of form builder, the left and right nav are the parent containers for the center form element. If all tabIndices are set to "0" then the left nav
 * gets tabbed first, then the right nav will get tabbed second, because both are the parent container, then the center form will get tabbed.
 *
 * XD Requested that the tab flow goes from left nav, to center form, to right nav. In order to accomplish this, tab order had to be numerically set. If multiple elements
 * on a page have the same tabIndex numeric value, then they will be tabbed through based on how they are laid out on the page. This is taken advantage of by switching children elements
 * from "-1" to the same tabIndex numeric value as its parent, allowing the children to then be tabbed. For example if the parent'st tabIndex="7" then changing all of it's children's
 * tabIndex from "-1" to "7" will force all children to be tabbed in order, after it's parent.
 *
 * NOTE: It is best to reorder the dom elements on the page, in order to get the desired tabbing flow order by using "0". However, in the case of formBuilder, the left and right nav
 * are dependent on the form being the child element, which knocks it out of the desired flow order.
 *
 * For future references:
 *
 * FORM_BUILDER_TOGGLE_NAV_BUTTON_TABINDEX can be found in
 *      - builderWrapper.js
 * USER_MENU_TAB_INDEX can be found in
 *      - builderWrapper.js
 * TOOL_PALETTE_TABINDEX is set in
 *      - listOfElements.js
 * the children elements tabIndices are set in
 *      - fieldTokenInMenu.js
 * FORM_TAB_INDEX can be found in
 *      - qbForm.js
 * the children elements tabIndices are set in
 *      - fieldEditingTools.js
 * FIELD_PROP_TABINDEX can be found in
 *      - fieldProperties.js
 * */

export const FORM_BUILDER_TOGGLE_NAV_BUTTON_TABINDEX = 1;
export const USER_MENU_TAB_INDEX = 2;
export const TOOL_PALETTE_TABINDEX = 3;
export const FORM_TAB_INDEX = 4;
export const FIELD_PROP_TABINDEX = 5;
export const CANCEL_BUTTON_TABINDEX = 6;
export const SAVE_BUTTON_TABINDEX = 7;



