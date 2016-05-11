import React from 'react';
import {I18nMessage} from '../../../utils/i18nMessage';
import CardView from './cardView';
import Loader  from 'react-loader';
import Fluxxor from 'fluxxor';
import {Collapse} from 'react-bootstrap';
import './cardViewList.scss';

let FluxMixin = Fluxxor.FluxMixin(React);
/**
 * A list of CardView items used to render a report at the small breakpoint
 */
let CardViewList = React.createClass({
    mixins: [FluxMixin],
    contextTypes: {
        history: React.PropTypes.object
    },
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
                return <CardViewList key={index} node={node}
                                         allowCardSelection={this.props.allowCardSelection}
                                         onToggleCardSelection={this.props.onToggleCardSelection}
                                         onRowSelected={this.props.onCardRowSelected}
                                         onRowClicked={this.props.onRowClicked}
                                         isRowSelected={this.props.isRowSelected}/>;
            });
        }

        return (
            <div>
                <h5 onClick={()=>this.setState({open: !this.state.open})}>
                    {
                        this.props.node.group || this.props.node.children && this.props.node.children.length ?
                        this.props.node.group :
                        <CardView key={this.props.node[this.props.uniqueIdentifier]}
                                  rowId={this.props.node[this.props.uniqueIdentifier]}
                                  data={this.props.node}
                                  allowCardSelection={this.props.allowCardSelection}
                                  onToggleCardSelection={this.props.onToggleCardSelection}
                                  onRowSelected={this.props.onCardRowSelected}
                                  onRowClicked={this.props.onRowClicked}
                                  isRowSelected={this.props.isRowSelected}
                                  metadataColumns={["actions"]}>
                        </CardView>
                    }
                </h5>
                <Collapse in={this.state.open}>
                    <div>
                        {childNodes}
                    </div>
                </Collapse>
            </div>
        );
    },

    render() {
        return (
            this.getRows()
        );
    }
});

export default CardViewList;
