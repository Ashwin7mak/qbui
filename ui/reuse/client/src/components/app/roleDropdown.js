import React from 'react';
import Select from 'react-select';
import {I18nMessage} from '../../utils/i18nMessage';

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

export default RoleDropdown;
