import React from 'react';
import Swipeable from 'react-swipeable';
import RecordActions from '../../actions/recordActions';
import './cardView.scss';
import '../../QBForm/qbform.scss';
import QBicon from '../../qbIcon/qbIcon';

const MAX_ACTIONS_RESIZE_WITH = 240; // max width while swiping

let CardView = React.createClass({
    propTypes: {
        data: React.PropTypes.object,
        rowId: React.PropTypes.number
    },

    getInitialState() {
        return {
            showMoreCards: false,
            showActions: false,
            swiping:false
        };
    },

    /**
     * toggle expanded card (unless in selection mode)
     * @param e event
     */
    handleMoreCard(e) {
        if (!this.props.allowCardSelection()) {
            this.setState({showMoreCards: !this.state.showMoreCards});

            e.stopPropagation(); // don't navigate to record
        }
    },

    createField(c, curKey) {
        return (<div key={c} className="field">
            <h5><small className="fieldLabel">{curKey}</small></h5>
            <span className="fieldValue">{this.props.data[curKey]}</span>
        </div>);
    },
    createTopField(firstFieldValue) {
        return (
            <div className="top-card-row field" onClick={this.handleMoreCard}>
                <strong>{firstFieldValue}</strong>
                <div className="card-expander" >
                    <QBicon icon="caret-right" className={this.state.showMoreCards ? "qbPanelHeaderIcon rotateDown" : "qbPanelHeaderIcon rotateUp"}/>
                </div>
            </div>
        );
    },
    createRow() {
        var fields = [];
        var keys = Object.keys(this.props.data);
        if (!keys.length) {
            return null;
        }
        let firstFieldValue = this.props.data[keys[0]];
        var topField = this.createTopField(firstFieldValue);
        for (var i = 1; i < keys.length; i++) {
            if (this.props.metadataColumns.indexOf(keys[i]) === -1) {
                fields.push(this.createField(i, keys[i]));
            }
        }

        return <div className="card">{topField}<div className={this.state.showMoreCards ? "fieldRow expanded" : "fieldRow collapsed"}>{fields}</div></div>;
    },

    /**
     * swipe in progress
     * @param event
     * @param delta x delta from touch starting position
     */
    swiping(event, delta) {

        if (!this.props.allowCardSelection()) {
            // add delta to current width (MAX_ACTIONS_RESIZE_WITH if open, 0 if closed) to get new size
            this.setState({
                resizeWidth: Math.max(this.state.showActions ? (delta + MAX_ACTIONS_RESIZE_WITH) : delta, 0),
                swiping: true
            });
        }
    },

    /**
     * finished swipe
     */
    swiped() {
        this.setState({
            swiping:false
        });
    },

    /**
     * either close selection column or show actions
     * @param e
     */
    swipedLeft(e) {

        if (this.props.allowCardSelection()) {
            this.props.onToggleCardSelection(false);
        } else if (!this.state.showActions) {
            this.setState({
                showActions: true
            });
        }
    },

    /**
     * hide actions column or show selection column if actions are not open
     */
    swipedRight() {

        if (this.state.showActions) {
            this.setState({
                showActions: false
            });
        } else if (!this.props.allowCardSelection()) {
            this.props.onToggleCardSelection(true, this.props.data);
        }
    },
    /* callback when row is selected */
    onRowSelected(e) {
        if (this.props.onRowSelected) {
            this.props.onRowSelected(this.props.data);
        }
    },
    /* close actions when row is clicked */
    onRowClick() {
        if (this.state.showActions) {
            this.setState({
                showActions: false
            });
        } else if (this.props.onRowClicked && !this.props.allowCardSelection()) {
            this.props.onRowClicked(this.props.data);
        }
    },
    render() {
        if (this.props.data) {
            let row = this.createRow();

            let actionsStyle = {};
            let cardStyle = {};

            let rowActionsClasses = "rowActions ";

            if (this.state.swiping) {
                rowActionsClasses += "swiping";
                actionsStyle = {
                    width: Math.min(MAX_ACTIONS_RESIZE_WITH, this.state.resizeWidth)
                };
                cardStyle = {
                    marginLeft: -actionsStyle.width,
                    marginRight: actionsStyle.width
                };
            } else {
                // not swiping, don't add inline style (width and transitions come from css)
                rowActionsClasses += this.state.showActions ? "open" : "closed";
            }

            const isSelected = this.props.isRowSelected(this.props.data);

            return (
                <Swipeable  className={"swipeable " + (this.state.showActions && !this.state.swiping ? "actionsOpen" : "actionsClosed") }
                            onSwiping={this.swiping}
                            onSwiped={this.swiped}
                            onSwipedLeft={this.swipedLeft}
                            onSwipedRight={this.swipedRight} >

                    <div className={this.state.showMoreCards ? "custom-row-card expanded" : "custom-row-card"} >
                        <div style={cardStyle} className="flexRow">
                            {this.props.allowCardSelection() && <div className={"checkboxContainer"}><input checked={isSelected} onChange={this.onRowSelected} type="checkbox"></input></div>}
                            <div className="card" onClick={this.onRowClick}>
                                {row}
                            </div>
                        </div>
                    </div>

                    <div ref={"actions"} style={actionsStyle} className={rowActionsClasses}>
                        <RecordActions  {...this.props}/>
                    </div>
                </Swipeable>
            );
        } else {
            return null;
        }
    }
});

export default CardView;
