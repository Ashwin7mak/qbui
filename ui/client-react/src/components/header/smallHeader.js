import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import {I18nMessage} from '../../utils/i18nMessage';
import _ from 'lodash';
import SearchBox from '../search/searchBox';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import './smallHeader.scss';
import {connect} from 'react-redux';
import * as ShellActions from '../../actions/shellActions';

/**
 * Skeleton for small-breakpoint header.
 */
var SmallHeader = React.createClass({
    propTypes: {
        /* additional classes for header */
        headerClasses: React.PropTypes.string,
        /* on click of search icon start search */
        enableSearch: React.PropTypes.bool,
        /* placeholder for searchbox*/
        searchPlaceHolder: React.PropTypes.string,
        /* optional key for searchbox */
        searchBoxKey: React.PropTypes.string,
        /* callback for search text */
        onSearchChange: React.PropTypes.func,
        /* callback for clear search text */
        onClearSearch: React.PropTypes.func,
        /* pre-populated value for search text */
        searchValue: React.PropTypes.string
    },
    getInitialState() {
        return {
            searching: false
        };
    },
    getDefaultProps() {
        return {
            enableSearch: false
        };
    },
    // no top nav present so the hamburger exists here
    onNavClick() {
        this.props.dispatch(ShellActions.toggleLeftNav());
    },
    // show the search elements
    startSearching() {
        if (this.props.enableSearch) {
            this.setState({searching: true});
        }
    },
    // hide the search elements
    cancelSearch() {
        this.setState({searching: false});
    },
    render() {
        let headerClasses = 'smallHeader' + (this.state.searching ? ' searching' : '');
        headerClasses += this.props.headerClasses ? ' ' + this.props.headerClasses : '';

        const unimplementedFavoritesTip = <Tooltip id="unimplemented.favorites.tt"><I18nMessage message="unimplemented.favorites"/></Tooltip>;

        return (<div className={headerClasses}>
            <div className="left">
                <a className="iconLink toggleNavButton" href="#" onClick={this.onNavClick}>
                    <QBicon icon="hamburger" />
                </a>
            </div>

            <div className="center title">
                {this.props.title}
            </div>

            <div className="center searchElements">
                <SearchBox className="smallHeaderSearchBox" searchBoxKey={this.props.searchBoxKey}
                           value={this.props.searchValue}
                           onChange={this.props.onSearchChange}
                           onClearSearch={this.props.onClearSearch}
                           placeholder={this.props.searchPlaceHolder} />
                <a className="cancelButton" href="#" onClick={this.cancelSearch}>
                    <I18nMessage message="cancel"/>
                </a>
            </div>

            <div className="right">
                <a className="iconLink" href="#" onClick={this.startSearching}>
                    <QBicon icon="search" />
                </a>
                <OverlayTrigger placement="left"
                                trigger={['hover', 'click']}
                                overlay={unimplementedFavoritesTip}>
                    <a className="iconLink" href="#" disabled>
                        <QBicon icon="star-full" />
                    </a>
                </OverlayTrigger>
            </div>
        </div>);
    }
});

export default connect()(SmallHeader);
