import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import './qbModal.scss';
import Breakpoints from "../../utils/breakpoints";
import QbIcon from '../qbIcon/qbIcon';


const QBModal = React.createClass({
    propTypes: {
        /**
         * this boolean sets whether or not the modal should be shown
         */
        show: React.PropTypes.bool,
        /**
         *This is the message for the modal body
         */
        bodyMessage: React.PropTypes.string,
        /**
         *This is the title for the modal title
         */
        title: React.PropTypes.string,
        /**
         *This is the QBIcon for the modal
         */
        qbIconName: React.PropTypes.string,
        /**
         *This is the name for the primary button
         */
        primaryButtonName: React.PropTypes.string,
        /**
         *This is the primary button onClick function
         */
        primaryButtonOnClick: React.PropTypes.func,
        /**
         *This is the name for the middle button
         */
        middleButtonName: React.PropTypes.string,
        /**
         *This is the middle button onClick function
         */
        middleButtonOnClick: React.PropTypes.func,
        /**
         *This is the name for the left button
         */
        leftButtonName: React.PropTypes.string,
        /**
         *This is the left button onClick function
         */
        leftButtonOnClick: React.PropTypes.func,
    },
    renderQBIcon() {
        let isSmall = Breakpoints.isSmallBreakpoint();
        //This function checks to see if there is a QBIcon
            //if there is a QBIcon then it will be placed on the page according to XD specs
            //if there is not a QBIcon then it will not render anything to the page
        if (this.props.qbIconName && this.props.title && !isSmall) {
            return <div className="largeQBIcon">
                <QbIcon icon={this.props.qbIconName} />
            </div>;
        }
        if (this.props.qbIconName) {
            return <div className="qbIcon">
                <QbIcon icon={this.props.qbIconName} />
            </div>;
        }
        return null;
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
            buttons.unshift(<Button key={buttons.length} className="middleButton" onClick={this.props.middleButtonOnClick}>{this.props.middleButtonName}</Button>);
        }

        if (this.props.leftButtonName) {
            buttons.unshift(<Button key={buttons.length} className="leftButton" onClick={this.props.leftButtonOnClick}>{this.props.leftButtonName}</Button>);
        }

        return (
            <div className={buttons.length === 1 ? 'singlePrimaryButtonContainer' : 'buttons'}>
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
                        <div className={(this.props.qbIconName ? 'hasIcon' : '')}>
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
