import React, {PropTypes, Component} from 'react';
import Locale from '../../locales/locale';
import './facet.scss';
import IconInputBox from '../iconInputBox/iconInputBox';

// IMPORTS FROM CLIENT REACT
import Logger from "../../../../../client-react/src/utils/logger";
// IMPORTS FROM CLIENT REACT

let logger = new Logger();

/*
 FilterSearchBox component takes user input for filtering a report.
 Takes the function to call on changes to search string, what he list is known as default is Records
 */
class GenericFilterSearchBox extends Component {

    constructor(props) {
        super(props);
        this.displayName = 'FacetsMenu';
    }

    render() {
        return (<div className="filterSearchBoxContainer">
                    <IconInputBox className="filterSearchBox"
                                  iconInputBoxKey={"filterSearchBox_" + this.props.searchBoxKey}
                                  value={this.props.searchTerm}
                                  onChange={this.props.onChange}
                                  onClear={this.props.clearSearchTerm}
                                  placeholder={this.props.placeholder}
                    />
                </div>
        );
    }
}

GenericFilterSearchBox.propTypes = {
    /**
     *  Function that filters the data based on input
     */
    onChange : React.PropTypes.func,
    /**
     *  Function that clears the data entered in the IconInputBox
     */
    clearSearchTerm : React.PropTypes.func,
    /**
     *   Value inside the search box
     */
    searchTerm: React.PropTypes.string,
    /**
     *   Describes where the genericFilterSearchBox component is being used
     */
    searchBoxKey: React.PropTypes.string,
    /**
     *   Text which is a placeholder for the searchBox component
     */
    placeholder: React.PropTypes.string
};

export default GenericFilterSearchBox;
