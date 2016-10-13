import React from 'react';
import ReactDOM from 'react-dom';
import {OverlayTrigger, Overlay, Tooltip} from 'react-bootstrap';

const ValidatedField = (FieldComponent) => {

    return React.createClass({


        getInitialState() {
            return {show: false};
        },

        onFocus(val) {
            this.setState({show: false});

            if (this.props.onFocus) {
                this.props.onFocus(val);
            }
        },
        onBlur(val) {
            this.setState({show: false});

            if (this.props.onBlur) {
                this.props.onBlur(val);
            }
        },

        onMouseEnterHandler() {
            var self = this;
            window.setTimeout(function() {
                self.setState({show: true});
            }, 300);
        },
        onMouseLeaveHandler() {
            var self = this;
            window.setTimeout(function() {
                self.setState({show: false});
            }, 300);
        },
        render() {
            if (this.props.invalid) {

                let newClasses = "borderOnError ";
                let {classes, ...rest} = this.props;

                if (classes) {
                    newClasses += classes;
                }

                let tooltip = <Tooltip className="invalidRecord qbTooltip">{this.props.invalidMessage}</Tooltip>;
                return (
                    <div style={{position: 'relative'}}
                         onMouseEnter={this.onMouseEnterHandler}
                         onMouseLeave={this.onMouseLeaveHandler}
                         onFocus={this.onFocus} >
                        <FieldComponent tabIndex={1} ref="target" classes={newClasses} {...rest} onBlur={this.onBlur}/>
                        <Overlay
                            show={this.state.show}
                            placement="top"
                            container={this}
                            overlay={tooltip}
                            target={() => ReactDOM.findDOMNode(this.refs.target)} >
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
