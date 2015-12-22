import React from 'react';

import Swipeable from 'react-swipeable';
import {Glyphicon} from '../../../../../node_modules/react-bootstrap/lib';
import ReportActions from '../../report/dataTable/reportActions';
import './cardView.scss';

class CardView extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = this.initState(...args);
        this.handleMoreCard = this.handleMoreCard.bind(this);

        this.swipedLeft = this.swipedLeft.bind(this);
        this.swipedRight = this.swipedRight.bind(this);
        this.swiping = this.swiping.bind(this);
        this.swiped = this.swiped.bind(this);
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
            fields.push(this.createField(i, keys[i]));
        }
        return <div className="card">{topField}<div className={this.state.showMoreCards ? "fieldRow expanded" : "fieldRow collapsed"}>{fields}</div></div>;
    }

    swiping(event, delta) {

        console.log('swiping');
        if (!this.state.swiping) {
            let widthStr = this.refs.actions.style.width;
            console.log('init widthstr',this.refs.actions.style.width);
            let width = Number(widthStr.substring(0, widthStr.length - 2));
            console.log('init width',width);
            this.setState({
                resizeStartWidth: width});

        }
        this.setState({
            swiping: true,
            resizingWidth: Math.max(delta + this.state.resizeStartWidth, 0)
        });
    }

    swiped() {
        console.log('swipe done');
        this.setState({
            swiping:false
        });
    }

    swipedLeft(e) {
        console.log('left');
        this.setState({
            showActions:true
        });
    }
    swipedRight(e) {
        console.log('right');
        this.setState({
            showActions:false
        });
    }
    render() {
        if (this.props.data) {
            let row = this.createRow();

            let actionsStyle = {};

            if (this.state.swiping) {
                actionsStyle = {
                    width: Math.min(200, this.state.resizingWidth)
                };
            }
            //console.log(actionsStyle);

            return (
                <Swipeable className={"swipeable"} onSwiping={this.swiping} onSwiped={this.swiped} onSwipedLeft={this.swipedLeft} onSwipedRight={this.swipedRight}>
                    <div className={this.state.showMoreCards ? "custom-row-card expanded" : "custom-row-card"}>
                        <div className="flexRow">
                            <div className="card">
                                {row}
                            </div>
                            <div className="card-expander" onClick={this.handleMoreCard}>
                                <span className={this.state.showMoreCards ? "chevron_opened" : "chevron_closed"}/>
                            </div>

                        </div>
                    </div>

                    <div ref={"actions"} style={actionsStyle} className={"rowActions " + (this.state.swiping ? "swiping" : (this.state.showActions ? "open" : "closed"))}>
                        <ReportActions />
                    </div>
                </Swipeable>
            );
        } else {
            return null;
        }
    }

}

export default CardView;
