import React from 'react';
import {I18nMessage} from '../../../utils/i18nMessage';
import CardView from './cardView';
import Loader  from 'react-loader';
import {Collapse} from 'react-bootstrap';
import './cardViewList.scss';
import QBicon from '../../qbIcon/qbIcon';

/**
 * A list of CardView items used to render a report at the small breakpoint
 */
let CardViewList = React.createClass({
    propTypes: {
        allowCardSelection: React.PropTypes.func,
        onToggleCardSelection: React.PropTypes.func,
        onRowSelected: React.PropTypes.func,
        onRowClicked: React.PropTypes.func,
        isRowSelected: React.PropTypes.func
    },

    getInitialState() {
        return {
            open: true
        };
    },

    getRows() {
        let childNodes;
        if (this.props.node.children) {
            childNodes = this.props.node.children.map((node, index) =>{
                let groupId = index.toString();
                if (this.props.groupId !== "") {
                    groupId = this.props.groupId + "." + index;
                }
                let groupLevel = groupId.split(".").length - 1;
                return <CardViewList key={index} groupId={groupId} groupLevel={groupLevel} node={node}
                                         allowCardSelection={this.props.allowCardSelection}
                                         onToggleCardSelection={this.props.onToggleCardSelection}
                                         onRowSelected={this.props.onRowSelected}
                                         onRowClicked={this.props.onRowClicked}
                                         isRowSelected={this.props.isRowSelected}/>;
            });
        }

        let className = "cardViewList group-level-" + this.props.groupLevel;
        let groupIcon = this.state.open ? "caret-filled-down" : "icon_caretfilledright";
        return (
            <div>
                {this.props.node.group || this.props.node.children && this.props.node.children.length ?
                    <div className={className}>
                        <div className="group-header" onClick={()=>this.setState({open: !this.state.open})}>
                            <QBicon icon={groupIcon} /> {this.props.node.group}
                        </div>
                        <Collapse in={this.state.open}>
                            <div>
                                <div>
                                    {childNodes}
                                </div>
                            </div>
                        </Collapse>
                    </div> :
                    <CardView key={this.props.node[this.props.uniqueIdentifier]}
                              rowId={this.props.node[this.props.uniqueIdentifier]}
                              data={this.props.node}
                              allowCardSelection={this.props.allowCardSelection}
                              onToggleCardSelection={this.props.onToggleCardSelection}
                              onRowSelected={this.props.onRowSelected}
                              onRowClicked={this.props.onRowClicked}
                              isRowSelected={this.props.isRowSelected}
                              metadataColumns={["actions"]}>
                    </CardView>
                }
            </div>
        );
    },

    render() {
        return (
            this.props.node ? this.getRows() : null
        );
    }
});

export default CardViewList;
