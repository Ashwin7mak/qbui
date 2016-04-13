import React from 'react';
import {I18nMessage} from '../../../utils/i18nMessage';
import CardView from './cardView';
import Loader  from 'react-loader';
import './cardViewList.scss';

let CardViewList = React.createClass({

    contextTypes: {
        touch: React.PropTypes.bool,
        history: React.PropTypes.object,
        flux: React.PropTypes.object
    },
    getInitialState() {
        return {
            selectedRows: [],
            allowCardSelection: false,
            toolsMenuOpen: false
        };
    },

    allowCardSelection() {
        return this.state.allowCardSelection;
    },

    onToggleCardSelection(allow = true, rowData = null) {
        this.setState({allowCardSelection: allow});

        if (!allow) {
            this.setState({selectedRows: []});
        } else if (rowData) {
            this.onCardRowSelected(rowData);
        }
    },
    /**
     * is row selected callback
     */
    isRowSelected(row) {
        return this.state.selectedRows.indexOf(row[this.props.uniqueIdentifier]) !== -1;
    },

    /**
     * report row was clicked
     * @param row data
     */
    onRowClicked(row) {

        const {appId, tblId} = this.props.reportData;
        var recId;

        //check to see if props exist, if they do we need to get recId from row.props.data (this is for non-custom row component clicks)
        if (row.props) {
            recId = row.props.data[this.props.uniqueIdentifier];
        } else {
            recId = row[this.props.uniqueIdentifier];
        }
        //create the link we want to send the user to and then send them on their way
        const link = `/app/${appId}/table/${tblId}/record/${recId}`;
        this.context.history.push(link);

        // something like this I expect, maybe in an action instead:
        // this.history.pushState(null, link);
    },

    /**
     * card row selection callback
     * @param row
     */
    onCardRowSelected(row) {

        const id = row[this.props.uniqueIdentifier];
        if (this.state.selectedRows.indexOf(id) === -1) {
            // not already selected, add to selectedRows
            this.state.selectedRows.push(row[this.props.uniqueIdentifier]);
            this.setState({selectedRows: this.state.selectedRows});
        } else {
            // already selected, remove from selectedRows
            this.setState({selectedRows: _.without(this.state.selectedRows, id)});
        }
    },

    /**
     * get table actions if we have them - render selectionActions prop if we have an active selection,
     * otherwise the reportHeader prop (cloned with extra key prop for transition group, and selected rows
     * for selectionActions component)
     */
    getTableActions() {

        const hasSelection = this.state.selectedRows.length;

        let classes = "tableActionsContainer secondaryBar";
        if (this.state.toolsMenuOpen) {
            classes += " toolsMenuOpen";
        }
        if (hasSelection) {
            classes += " selectionActionsOpen";
        }
        return (this.props.reportHeader && this.props.selectionActions && (
            <div className={classes}>{hasSelection ?
                React.cloneElement(this.props.selectionActions, {
                    key: "selectionActions",
                    selection: this.state.selectedRows
                }) :
                React.cloneElement(this.props.reportHeader, {
                    key: "reportHeader",
                    onMenuEnter: this.onMenuEnter,
                    onMenuExit: this.onMenuExit
                })}
            </div>));
    },

    getRows(results) {

        let cardViewListClasses = this.state.selectedRows.length ? "cardViewList selectedRows" : "cardViewList";
        if (this.state.allowCardSelection) {
            cardViewListClasses += " allowCardSelection";
        }
        const records = this.props.reportData.data ? this.props.reportData.data.filteredRecords : [];
        return (
            <div className={cardViewListClasses} ref="cardViewList">

                {records.map((record, i) => {
                    return <CardView key={i}
                                     rowId={i}
                                     data={record}
                                     allowCardSelection={this.allowCardSelection}
                                     onToggleCardSelection={this.onToggleCardSelection}
                                     onRowSelected={this.onCardRowSelected}
                                     onRowClicked={this.onRowClicked}
                                     isRowSelected={this.isRowSelected}/>;
                })
                }
            </div>);
    },
    componentDidMount() {
        this.refs.cardViewListWrapper.addEventListener("scroll", this.props.onScroll);
    },
    componentWillUnmount() {
        this.refs.cardViewListWrapper.removeEventListener("scroll", this.props.onScroll);
    },

    render() {

        let results = this.props.reportData && this.props.reportData.data ? this.props.reportData.data.filteredRecords : [];

        return (
            <div className="reportTable">

                {this.getTableActions()}

                <div className="tableLoaderContainer" ref="cardViewListWrapper">
                    <Loader loaded={!this.props.reportData.loading}>
                        {results ?
                            this.getRows(results) :
                            <div className="noData"><I18nMessage message={'grid.no_data'}/></div>}
                    </Loader>
                    { //keep empty placeholder when loading to reduce reflow of space, scrollbar changes
                        this.props.reportData.loading ? <div className="loadedContent"></div> : null
                    }
                </div>
            </div>
        );
    }
});

export default CardViewList;
