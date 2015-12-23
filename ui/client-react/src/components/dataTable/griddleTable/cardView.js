import React from 'react';
import Tappable from 'react-tappable';
import Swipeable from 'react-swipeable';
import {Glyphicon} from '../../../../../node_modules/react-bootstrap/lib';
import ReportActions from '../../actions/reportActions';
import './cardView.scss';

const MAX_ACTIONS_RESIZE_WITH = 180; // max width while swiping

class CardView extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = this.initState(...args);
        this.handleMoreCard = this.handleMoreCard.bind(this);

        this.swipedLeft = this.swipedLeft.bind(this);
        this.swipedRight = this.swipedRight.bind(this);
        this.swiping = this.swiping.bind(this);
        this.swiped = this.swiped.bind(this);
        this.onRowPressed = this.onRowPressed.bind(this);
        this.onRowSelected = this.onRowSelected.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
    }

    initState() {
        let initialState = {
            showMoreCards: false,
            showActions: false,
            swiping:false
        };
        return initialState;
    }

    handleMoreCard() {
        this.setState({showMoreCards: !this.state.showMoreCards});
    }

    createField(c, curKey) {
        return (<div key={c} className="field">
            <span className="fieldLabel">{curKey}</span>
            <span className="fieldValue">{this.props.data[curKey]}</span>
        </div>);
    }
    createRow(){
        var fields = [];
        var keys = Object.keys(this.props.data);
        if (!keys.length) {
            return null;
        }
        var topField = <div className="top-card-row field"><strong>{this.props.data[keys[0]]}</strong></div>;
        for (var i = 1; i < keys.length; i++) {

            // ignore metadata columns
            if (this.props.metadataColumns.indexOf(keys[i]) === -1) {
                fields.push(this.createField(i, keys[i]));
            }
        }
        return <div className="card">{topField}<div className={this.state.showMoreCards ? "fieldRow expanded" : "fieldRow collapsed"}>{fields}</div></div>;
    }

    /**
     * swipe in progress
     * @param event
     * @param delta x delta from touch starting position
     */
    swiping(event, delta) {

        // add delta to current width (MAX_ACTIONS_RESIZE_WITH if open, 0 if closed) to get new size
        this.setState({
            resizeWidth: Math.max(this.state.showActions ? (delta + MAX_ACTIONS_RESIZE_WITH) : delta, 0),
            swiping: true
        });
    }

    swiped() {
        this.setState({
            swiping:false
        });
    }

    swipedLeft(e) {
        this.setState({
            showActions:true
        });
    }
    swipedRight(e) {
        this.setState({
            showActions:false
        });
    }
    /* callback when row is long-pressed */
    onRowPressed() {
        if (this.props.data.onRowPressed) {
            this.props.data.onRowPressed(this.props.data);
        }
    }
    /* callback when row is selected */
    onRowSelected(e) {
        if (this.props.data.onRowSelected) {
            this.props.data.onRowSelected(this.props.data);
        }
    }
    /* close actions when row is clicked */
    onRowClick() {
        this.setState({
            showActions:false
        });
    }
    render() {

        if (this.props.data) {
            let row = this.createRow();

            let actionsStyle = {};
            let rowActionsClasses = "rowActions ";

            if (this.state.swiping) {
                rowActionsClasses += "swiping";
                actionsStyle = {
                    width: Math.min(MAX_ACTIONS_RESIZE_WITH, this.state.resizeWidth)
                };
            } else {
                // not swiping, don't add inline style (width and transitions come from css)
                rowActionsClasses += this.state.showActions ? "open" : "closed";
            }

            return (
                <Swipeable className={"swipeable"} onSwiping={this.swiping} onSwiped={this.swiped} onSwipedLeft={this.swipedLeft} onSwipedRight={this.swipedRight}>
                    <Tappable onPress={this.onRowPressed} pressDelay={1000} onClick={this.onRowClick}>
                        <div className={this.state.showMoreCards ? "custom-row-card expanded" : "custom-row-card"}>
                            <div className="flexRow">
                                <div className={"checkboxContainer"}><input checked={this.props.data.selected} onChange={this.onRowSelected} type="checkbox"></input></div>
                                <div className="card">
                                    {row}
                                </div>
                                <div className="card-expander" onClick={this.handleMoreCard}>
                                    <span className={this.state.showMoreCards ? "chevron_opened" : "chevron_closed"}/>
                                </div>

                            </div>
                        </div>
                    </Tappable>

                    <div ref={"actions"} style={actionsStyle} className={rowActionsClasses}>
                        <ReportActions {...this.props}/>
                    </div>
                </Swipeable>
            );
        } else {
            return null;
        }
    }
}

export default CardView;
