import React from 'react';
import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import './facet.scss';
import SearchBox from '../search/searchBox';
import {connect} from 'react-redux';

let logger = new Logger();

/*
 FilterSearchBox component takes user input for filtering a report.
 Takes the function to call on changes to search string, what he list is known as default is Records
 */
export const FilterSearchBox = React.createClass({

    displayName: 'FilterSearchBox',
    propTypes: {
        onChange : React.PropTypes.func,
        clearSearchString : React.PropTypes.func
    },

    render() {

        let placeMsg = Locale.getMessage("report.searchPlaceHolder") + " " + Locale.getMessage("records.plural");

        return (<div className="filterSearchBoxContainer">
                    <SearchBox className="filterSearchBox" searchBoxKey={"filterSearchBox_" + this.props.searchBoxKey}
                               value={this.props.search.searchInput}
                               onChange={this.props.onChange}
                               onClearSearch={this.props.clearSearchString}
                               placeholder={placeMsg} />
                </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        search: state.search
    };
};

export default connect(
    mapStateToProps
)(FilterSearchBox);
