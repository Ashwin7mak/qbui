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
        rowId: React.PropTypes.number,
        onSwipe: React.PropTypes.func
    },

    getInitialState() {
        return {
            showMoreCards: false,
            showActions: false,
            swipingSelection:false,
            swipingActions:false
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
            <span className="fieldLabel">{curKey}</span>
            <span className="fieldValue">{this.props.data[curKey].display}</span>
        </div>);
    },
    createTopField(firstFieldValue) {
        return (
            <div className="top-card-row field">
                <strong>{firstFieldValue.display}</strong>
                <div className="card-expander" onClick={this.handleMoreCard}>
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
            fields.push(this.createField(i, keys[i]));
        }

        return <div className="card">{topField}<div className={this.state.showMoreCards ? "fieldRow expanded" : "fieldRow collapsed"}>{fields}</div></div>;
    },

    /**
     * swipe in progress
     * @param event
     * @param delta x delta from touch starting position
     */
    swiping(event, delta) {

        const selectionOpen = this.props.allowCardSelection();

        let swipingActions = this.state.swipingActions || this.state.showActions;
        let swipingSelection = this.state.swipingSelection || selectionOpen;

        if (!this.state.swipingActions && !this.state.swipingSelection) {
            // starting a new swipe

            swipingActions = this.state.showActions || (!selectionOpen && delta > 0);
            swipingSelection = !swipingActions;

            this.setState({
                swipingSelection,
                swipingActions
            });
        }

        // handle the swipe itself

        if (swipingActions) {
            // add delta to current width (MAX_ACTIONS_RESIZE_WITH if open, 0 if closed) to get new size
            this.setState({
                resizeWidth: Math.max(this.state.showActions ? (delta + MAX_ACTIONS_RESIZE_WITH) : delta, 0)
            });
        } else {
            // swiping right - delegate swipe to parent components (swiping checkbox column)
            this.props.onSwipe(delta);
        }
    },


    /**
     * either close selection column or show actions
     * @param e
     */
    swipedLeft(e) {
        if (this.state.swipingSelection) {
            this.props.onToggleCardSelection(false);
        } else if (this.state.swipingActions) {
            this.setState({
                showActions: true
            });
        }
        this.setState({
            swipingActions:false,
            swipingSelection:false
        });
    },

    /**
     * hide actions column or show selection column if actions are not open
     */
    swipedRight() {
        if (this.state.swipingActions) {
            this.setState({
                showActions: false
            });
        } else if (!this.props.allowCardSelection()) {
            this.props.onToggleCardSelection(true, this.props.data);
        }
        this.setState({
            swipingActions:false,
            swipingSelection:false
        });
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

            if (this.state.swipingActions) {
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
                <Swipeable  className={"swipeable " + (this.state.showActions && !this.state.swipingActions ? "actionsOpen" : "actionsClosed") }
                            onSwiping={this.swiping}
                            onSwipedLeft={this.swipedLeft}
                            onSwipedRight={this.swipedRight} >

                    <div className={this.state.showMoreCards ? "custom-row-card expanded" : "custom-row-card"} >
                        <div style={cardStyle} className="flexRow">
                            <div className={"checkboxContainer"}>
                                <input checked={isSelected} onChange={this.onRowSelected} type="checkbox"></input>
                            </div>
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
