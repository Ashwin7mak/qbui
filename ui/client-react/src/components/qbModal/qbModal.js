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
        show: React.PropTypes.boolean,
        /**
         *This is the message for the modal body
         */
        modalBodyMessage: React.PropTypes.string,
        /**
         *This is the title for the modal title
         */
        modalTitle: React.PropTypes.string,
        /**
         *This is the QBIcon for the modal
         */
        QBIconName: React.PropTypes.string,
        /**
         *This is primary button
         */
        primaryButtonName: React.PropTypes.string,
        /**
         *This is the primary button onClick function
         */
        primaryButtonOnClick: React.PropTypes.func,
        /**
         *This is an array of buttons for the left side of the footer
         */
        buttonArrayLeft: React.PropTypes.string,
        /**
         *This is an array of buttons for the right side of the footer
         */
        buttonArrayRight: React.PropTypes.string
    },
    renderQBIcon() {
        let isSmall = Breakpoints.isSmallBreakpoint();
        //This function checks to see if there is a QBIcon
            //if there is a QBIcon then it will be placed on the page according to XD specs
            //if there is not a QBIcon then it will not render anything to the page
        if (this.props.QBIconName && this.props.modalTitle && !isSmall) {
            return <div className="largeModalQBIcon">
                <QbIcon icon={this.props.QBIconName} />
            </div>;
        }
        if (this.props.QBIconName) {
            return <div className="modalQBIcon">
                <QbIcon icon={this.props.QBIconName} />
            </div>;
        }
        return null;
    },
    renderTitle() {
        if (this.props.modalTitle) {
            return <div className="modalTitle">
                {this.props.modalTitle[0]}
                </div>;
        }
        return null;
    },
    renderBody() {
        if (this.props.modalTitle) {
            return <div className="modalTextWithTitle ">
                {this.props.modalBodyMessage[0]}
            </div>;
        }
        return <div className="modalText">
            {this.props.modalBodyMessage[0]}
            </div>;
    },
    renderButton() {
        let isSmall = Breakpoints.isSmallBreakpoint();
        //This functions checks to see how many buttons the modal has
            //It will place and style the buttons based off of the total button count
        if (isSmall) {
            return <div>
                <div className="smallPrimaryButton" ><Button bsStyle="primary" onClick={this.props.primaryButtonOnClick}>{this.props.primaryButtonName}</Button></div>
                <div className="smallSecondaryButton">{this.props.buttonArrayRight[0]}</div>
                <div className="smallTertiaryButton">{this.props.buttonArrayLeft[0]}</div>
            </div>;
        }
        if (this.props.buttonArrayLeft && this.props.buttonArrayRight) {
            if (this.props.buttonArrayLeft.length + this.props.buttonArrayRight.length === 3) {
                return <div>
                    <div className="tertiaryButton">{this.props.buttonArrayLeft[0]}</div>
                    <div className="secondaryButton">{this.props.buttonArrayRight[0]}</div>
                    <div className="primaryButton" ><Button bsStyle="primary" onClick={this.props.primaryButtonOnClick}>{this.props.primaryButtonName}</Button></div>
                </div>;
            }
            if (this.props.buttonArrayLeft.length + this.props.buttonArrayRight.length === 2) {
                return <div>
                    <div className="tertiaryButton">{this.props.buttonArrayLeft[0]}</div>
                    <div className="primaryButton"><Button bsStyle="primary" onClick={this.props.primaryButtonOnClick}>{this.props.primaryButtonName}</Button></div>
                </div>;
            }
        }
        return <div className="singlePrimaryButton">
            <Button bsStyle="primary" onClick={this.props.primaryButtonOnClick}>{this.props.primaryButtonName}</Button>
        </div>;
    },
    render() {
        let modalTitleAndBody = "modalTitleAndBody";
        if (this.props.modalTitle && this.props.modalQBIcon) {
            modalTitleAndBody = "modalTitleAndBodyAndQBIcon";
        }
        return (
            <div>
                <Modal className="qbModal" show={this.props.show} onHclassNamee={this.close}>
                    <div className="bodyContainer">
                        {this.renderQBIcon()}
                        <div className={modalTitleAndBody}>
                            <Modal.Title>
                                {this.renderTitle()}
                            </Modal.Title>
                            <Modal.Body>
                                {this.renderBody()}
                            </Modal.Body>
                        </div>
                    </div>
                    <Modal.Footer>
                        {this.renderButton()}
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
});

export default QBModal;
