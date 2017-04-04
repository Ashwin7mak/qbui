import React, {PropTypes, Component} from 'react';
import Icon from '../icon/icon';

// This element is not imported, but classes from bootstrap are using for styling a custom input.
// If these imports are no longer valid, new styles should also be used for this element.
// I'm leaving the import here, but commented out so it will be picked up by a global search if react-bootstrap is removed.
// import FormControl from 'react-bootstrap/lib/FormControl';

import './searchBoxInMenu.scss';

const SearchBoxInMenu = ({searchText, placeholder, onChange}) => (
    <div className="searchBoxInMenu form-group has-feedback">
        <input className="form-control" type="text" value={searchText} onChange={onChange} placeholder={placeholder} />
        <Icon className="form-control-feedback" icon="search" />
    </div>
);

SearchBoxInMenu.propTypes = {
    /**
     * The current text in the search box */
    searchText: PropTypes.string,

    /**
     * The text that appears as placeholder in the input box. It should be localized before passing to this component. */
    placeholder: PropTypes.string,

    /**
     * A callback that will be fired when the text is changed. It will receive one argument the onChange event. */
    onChange: PropTypes.func,
};

SearchBoxInMenu.defaultProps = {
    searchText: ''
};

export default SearchBoxInMenu;
