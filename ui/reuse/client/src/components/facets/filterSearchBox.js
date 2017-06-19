import React from 'react';
import Locale from '../../locales/locale';
import './facet.scss';
import IconInputBox from '../iconInputBox/iconInputBox';
import {connect} from 'react-redux';

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
                    <IconInputBox className="filterSearchBox" iconInputBoxKey={"filterSearchBox_" + this.props.searchBoxKey}
                               value={this.props.search.searchInput}
                               onChange={this.props.onChange}
                               onClear={this.props.clearSearchString}
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
