import React from 'react';

import ReactBootstrap from 'react-bootstrap';
import {Button,Glyphicon} from '../../../../../node_modules/react-bootstrap/lib'

class CardView  extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = this.initState(...args);
        this.handleMoreCard = this.handleMoreCard.bind(this);
    }

    initState() {
        let initialState ={
            showMoreCards: false
        }
        return initialState;
    }

    handleMoreCard(){
        this.setState({ showMoreCard: !this.state.showMoreCard });
    }

    createColumn(key, column){
        //create a new column for a row
        var spanClass = column + "-value";
        return(
        <div className={column}>
            <span className="text-info">{key}</span>
            <span className={spanClass}>{this.props.data[key]}</span>
        </div>);
    }

    createRow(c, curKey, curKeyPlus1){
        var classRow = c == 3 ? "top-card-row card-row" : "bottom-card-row card-row";
        return(<div className={classRow}>
            {this.createColumn(curKey, "left-col")}
            {this.createColumn(curKeyPlus1, "right-col")}
        </div>);
    }

    render(){
        var fields = [];
        var additionalCards = [];
        for (var i = 0; i < Object.keys(this.props.data).length; i++) {
            var values = [];
            var addCardValues = [];
            var keys = Object.keys(this.props.data);
            for (var c = 0; ((c < keys.length) && (c < 7)); c++) {
                if(c == 0) {
                    values.push(<div className="top-card-row"><strong>{this.props.data[keys[c]]}</strong></div>)
                }
                else if (c == 1){
                    //check to see if I can drop in the next two
                    if (c + 1 < keys.length) {
                        //we can!
                        values.push(this.createRow(c,keys[c],keys[c+1]));
                        c++;
                    }
                    else {
                        //we cannot!
                    }
                }
                else {
                    //this.createHiddenCard(c, keys);
                    if (c + 1 < keys.length) {
                        //we can!
                        addCardValues.push(this.createRow(c,keys[c],keys[c+1]));
                        c++;
                    }
                    else {
                        addCardValues.push(this.createColumn(keys[c],"left-col"))
                    }
                }
            }
            fields.push(values[i]);
            additionalCards.push(addCardValues[i]);
        }
        return (
            <div className="custom-row-card">
                <div className="flexRow">
                    <div className="card">
                        {fields}
                    </div>
                    <div className="card-expand" onClick={this.handleMoreCard}>
                        <Glyphicon glyph={this.state.showMoreCard ? "chevron-up" : "chevron-down"} />
                    </div>
                </div>
                <div className="flexRow grayBackground">
                    <div className={this.state.showMoreCard ? "show-more-card" : "hide-more-card"}>
                        {additionalCards}
                    </div>
                    <div className={this.state.showMoreCard? "card-expand-hidden": "displayNone"}>
                        <Glyphicon glyph={this.state.showMoreCard ? "chevron-up" : "chevron-down"} />
                    </div>
                </div>
            </div>
        );
    }

}

export default CardView;