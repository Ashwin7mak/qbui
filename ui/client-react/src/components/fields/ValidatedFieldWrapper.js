import React from 'react';
import ReactDOM from 'react-dom';
import QBToolTip from '../qbToolTip/qbToolTip';
import {OverlayTrigger, Overlay, Tooltip} from 'react-bootstrap';

const ValidatedField = (FieldComponent) => {

    return React.createClass({


        getInitialState() {
            return {hasFocus: false};
        },

        onFocus(val) {
            this.setState({hasFocus: true});

            if (this.props.onFocus) {
                this.props.onFocus(val);
            }
        },
        onBlur(val) {
            this.setState({hasFocus: false});

            if (this.props.onBlur) {
                this.props.onBlur(val);
            }
        },

        render() {
            if (this.props.isInvalid) {

                let newClasses = "error ";
                let {classes, ...rest} = this.props;

                if (classes) {
                    newClasses += classes;
                }

                let tooltip = <Tooltip className="invalidRecord qbTooltip">{this.props.invalidMsg}</Tooltip>
                return (
                    <div style={{position: 'relative' }}>
                        <FieldComponent tabIndex={1} ref="target" classes={newClasses} {...rest} onFocus={this.onFocus} onBlur={this.onBlur}/>
                        <Overlay
                            show={!this.state.hasFocus}
                            placement="top"
                            container={this}
                            overlay={tooltip}
                            target={() => ReactDOM.findDOMNode(this.refs.target)}
                            trigger="hover">
                            {tooltip}
                        </Overlay>
                    </div>);
            } else {
                return (
                    <FieldComponent {...this.props}/>
                );
            }

        }
    });
};

export default ValidatedField;
