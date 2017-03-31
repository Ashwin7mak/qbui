import React, {PropTypes, Component} from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Icon from '../icon/icon';

import './searchBoxInMenu.scss';

const SearchBoxInMenu = ({searchText, onChange}) => (
    <FormGroup controlId="formValidationSuccess3" validationState="success" bsClass="form-group searchBoxInMenu">
        <FormControl type="text" value={searchText} onChange={onChange} />
        <FormControl.Feedback>
            <Icon icon="search" />
        </FormControl.Feedback>
    </FormGroup>
);

SearchBoxInMenu.propTypes = {
    /**
     * The current text in the search box */
    searchText: PropTypes.string,

    /**
     * A callback that will be fired when the text is changed. It will receive one argument the onChange event. */
    onChange: PropTypes.func,
};

SearchBoxInMenu.defaultProps = {
    searchText: ''
};

export default SearchBoxInMenu;
