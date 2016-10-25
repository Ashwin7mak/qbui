import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import './qbModal.scss';
import Breakpoints from "../../utils/breakpoints";
import QbIcon from '../qbIcon/qbIcon';

const QB_MODAL_ALERT = 'alert';
const QB_MODAL_STANDARD = 'standard';
const QB_MODAL_SUCCESS = 'success';
const QB_MODAL_TYPES = [QB_MODAL_ALERT, QB_MODAL_STANDARD, QB_MODAL_SUCCESS];

const QBModal = React.createClass({
    propTypes: {
        /**
         * This boolean sets whether or not the modal should be shown
         */
        show: React.PropTypes.bool,
        /**
         *This is the message for the modal body
         */
        bodyMessage: React.PropTypes.string,
        /**
         * This is the title for the modal title
         */
        title: React.PropTypes.string,
        /**
         * This is the type of alert (alert, success, or standard[no icon])
         */
        type: React.PropTypes.oneOf(QB_MODAL_TYPES),
        /**
         * This is the name for the primary button
         */
        primaryButtonName: React.PropTypes.string,
        /**
         * This is the primary button onClick function
         */
        primaryButtonOnClick: React.PropTypes.func,
        /**
         * This is the name for the middle button
         */
        middleButtonName: React.PropTypes.string,
        /**
         * This is the middle button onClick function
         */
        middleButtonOnClick: React.PropTypes.func,
        /**
         * This is the name for the left button
         */
        leftButtonName: React.PropTypes.string,
        /**
         * This is the left button onClick function
         */
        leftButtonOnClick: React.PropTypes.func,
    },
    getDefaultProps() {
        return {
            type: 'standard'
        };
    },
    /**
     * This function checks to see if there is a QBIcon for the modal
     * if there is a QBIcon then it will be placed on the page according to XD specs
     * if there is not a QBIcon then it will not render anything to the page
     * @returns {*}
     */
    renderQBIcon() {
        if (QB_MODAL_TYPES.indexOf(this.props.type) < 0 || this.props.type === 'standard') {
            return null;
        }

        let isSmall = Breakpoints.isSmallBreakpoint();

        let classes = ['modalIcon'];
        let icon = 'alert';

        if (this.props.qbIconName && this.props.title && !isSmall) {
            classes.push('modalIcon--large');
        }

        if (this.props.type === QB_MODAL_ALERT) {
            classes.push('modalIcon--alert');
        }

        if (this.props.type === QB_MODAL_SUCCESS) {
            classes.push('modalIcon--success');
            icon = 'check';
        }

        return (
            <div className={classes.join(' ')}>
                <QbIcon icon={icon} />
            </div>
        );
    },
    renderTitle() {
        if (this.props.title) {
            return <div className="title">
                {this.props.title}
                </div>;
        }
        return null;
    },
    renderBody() {
        if (this.props.title) {
            return <div className="textWithTitle ">
                {this.props.bodyMessage}
            </div>;
        }
        return <div className="text">
            {this.props.bodyMessage}
            </div>;
    },
    renderButtons() {
        let buttons = [
            <Button key={0} className="primaryButton" onClick={this.props.primaryButtonOnClick}>{this.props.primaryButtonName}</Button>
        ];

        if (this.props.middleButtonName) {
            buttons.unshift(<Button key={buttons.length} className="secondaryButton middleButton" onClick={this.props.middleButtonOnClick}>{this.props.middleButtonName}</Button>);
        }

        if (this.props.leftButtonName) {
            buttons.unshift(<Button key={buttons.length} className="secondaryButton leftButton" onClick={this.props.leftButtonOnClick}>{this.props.leftButtonName}</Button>);
        }

        return (
            <div className={buttons.length === 1 ? 'buttons singlePrimaryButtonContainer' : 'buttons'}>
                {buttons}
            </div>
        );
    },
    render() {
        return (
            <div>
                <Modal className="qbModal" show={this.props.show}>
                    <div className="bodyContainer">
                        {this.renderQBIcon()}
                        <div>
                            <Modal.Title>
                                {this.renderTitle()}
                            </Modal.Title>
                            <Modal.Body>
                                {this.renderBody()}
                            </Modal.Body>
                        </div>
                    </div>
                    <Modal.Footer>
                        {this.renderButtons()}
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
});

export default QBModal;
