import React, {PropTypes} from 'react';
import Select from 'react-select';
import {I18nMessage} from '../../utils/i18nMessage';

/**
 * Dropdown with a List of App Roles
 * @param props
 * @returns {XML}
 * @constructor
 */
const RoleDropdown = (props) =>{
    return (<div className="assignRole panel-items">
		<div className={props.titleClass}><I18nMessage message={props.title}/></div>
		<Select
			autofocus
			simpleValue
			{...props}
		/>
	</div>);
};

RoleDropdown.propTypes = {
	/**
	 * class for the title */
    titleClass: PropTypes.string,
	/**
	 * options array formatted based on react-select
	 */
    options: PropTypes.arrayOf(PropTypes.object),
	/**
	 * set list to be searchable
	 */
    searchable: PropTypes.bool,
	/**
	 * set input field to be clearable
	 */
    clearable: PropTypes.bool,
	/**
	 * selected value
	 */
    value: PropTypes.object,
	/**
	 * function to handle on selected item change
	 */
    onChange: PropTypes.func,
	/**
	 * title above dropdown
	 */
    title: PropTypes.string,
};

export default RoleDropdown;
