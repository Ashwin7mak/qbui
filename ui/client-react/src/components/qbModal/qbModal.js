import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import './qbModal.scss';
import QbIcon from '../qbIcon/qbIcon';

const QB_MODAL_ALERT = 'alert';
const QB_MODAL_STANDARD = 'standard';
const QB_MODAL_SUCCESS = 'success';
const QB_MODAL_DELETE = 'delete';
/**
 * qbModal's size automatically defaults to small, QB_MODAL_SIZE will be left as an array,
 * so in the future when there are specs for a 'medium' size it can be added here
 */
const QB_MODAL_SIZE = ['large'];
const QB_MODAL_TYPES = [QB_MODAL_ALERT, QB_MODAL_STANDARD, QB_MODAL_SUCCESS, QB_MODAL_DELETE];

const QBModal = React.createClass({
    propTypes: {
        /**
         * Pass in a unique className, to make the qbModals easier to uniquely style and to test
         * */
        uniqueClassName: React.PropTypes.string,
        /**
         * This boolean sets whether or not the modal should be shown
         */
        show: React.PropTypes.bool,
        /**
         * Pass in a string of "small" or "large" to resize your modal, if no size is pass it defaults to "small"
         * */
        size: React.PropTypes.oneOf(QB_MODAL_SIZE),
        /**
         * Pass in a link to have a button reroute to a new url
         * */
        link: React.PropTypes.string,
        /**
         *This is the message for the modal body
         */
        bodyMessage: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
        /**
         * This is the title for the modal title
         */
        title: React.PropTypes.string,
        /**
         * This is the type of alert (alert, success, or standard[no icon])
         */
        type: React.PropTypes.oneOf(QB_MODAL_TYPES),
        /**
         * This is the name for the primary button. The primary button is required in order for any other button to be added to a modal.
         */
        primaryButtonName: React.PropTypes.string,
        /**
         * This is the primary button onClick function
         */
        primaryButtonOnClick: React.PropTypes.func,
        /**
         * Setting to true disables the primary button.
         */
        primaryButtonDisabled: React.PropTypes.bool,
        /**
         * This is the name for the middle button. There must be a primary button, in order for there to be a middle button.
         */
        middleButtonName: React.PropTypes.string,
        /**
         * This is the middle button onClick function
         */
        middleButtonOnClick: React.PropTypes.func,
        /**
         * This is the name for the left button. There must be a primary button, in order for there to be a left button.
         */
        leftButtonName: React.PropTypes.string,
        /**
         * This is the left button onClick function
         */
        leftButtonOnClick: React.PropTypes.func,
    },
    getDefaultProps() {
        return {
            type: 'standard',
            primaryButtonDisabled: false
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
        let classes = ['modalIcon'];
        let icon = 'alert-fill';

        if (this.props.type === QB_MODAL_ALERT) {
            classes.push('modalIcon--alert');
        }

        if (this.props.type === QB_MODAL_SUCCESS) {
            classes.push('modalIcon--success');
            icon = 'check-reversed';
        }

        if (this.props.type === QB_MODAL_DELETE) {
            classes.push('modalIcon--error');
            icon = 'errorincircle-fill';
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
        //The conditions below dictates the css style for the body message
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
        if (!this.props.primaryButtonName) {
            return null;
        }

        let buttons = [
            <Button key={0} className="primaryButton" onClick={this.props.primaryButtonOnClick} disabled={this.props.primaryButtonDisabled}>{this.props.primaryButtonName}</Button>
        ];
        if (this.props.link) {
            buttons = [
                <a key={0} className="anchorButton  primaryButton" href={this.props.link} onClick={this.props.primaryButtonOnClick}>{this.props.primaryButtonName}</a>
            ];
        }

        if (this.props.middleButtonName) {
            buttons.unshift(<Button key={buttons.length} className="secondaryButton middleButton"
                                    onClick={this.props.middleButtonOnClick}>{this.props.middleButtonName}</Button>);
        }

        if (this.props.leftButtonName) {
            buttons.unshift(<Button key={buttons.length} className="secondaryButton leftButton"
                                    onClick={this.props.leftButtonOnClick}>{this.props.leftButtonName}</Button>);
        }

        return (
            <Modal.Footer>
                <div className={buttons.length === 1 ? 'buttons singlePrimaryButtonContainer' : 'buttons'}>
                    {buttons}
                </div>
            </Modal.Footer>
        );
    },
    /**
     * this.props.children is being passed to Modal.body
     * this allows jsx to be passed in, instead of a string
    */
    render() {
        let classNames = ['qbModal'];
        if (this.props.uniqueClassName) {
            classNames.push(this.props.uniqueClassName);
        }
        classNames.push(this.props.size || '');
        return (
            <div>
                <Modal className={classNames.join(' ')} show={this.props.show}>
                    <div className="bodyContainer">
                        {this.renderQBIcon()}
                        <div>
                            <Modal.Title>
                                {this.renderTitle()}
                            </Modal.Title>
                            <Modal.Body>
                                {this.renderBody()}
                                {this.props.children}
                            </Modal.Body>
                        </div>
                    </div>
                    {this.renderButtons()}
                </Modal>
            </div>);
    }
});

export default QBModal;
