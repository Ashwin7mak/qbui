import React from 'react';
import {Modal} from 'react-bootstrap';
import './qbModal.scss';
import Breakpoints from "../../utils/breakpoints";

const QBModals = React.createClass({
    propTypes: {
        /**
         * this boolean sets whether or not the modal should be shown
         */
        bool: React.PropTypes.boolean,
        /**
         *This is the message for the modal body
         */
        modalBodyMessage: React.PropTypes.array,
        /**
         *This is the title for the modal title
         */
        modalTitle: React.PropTypes.string,
        /**
         *This is the QBIcon for the modal
         */
        modalQBIcon: React.PropTypes.array,
        /**
         *This is an array of buttons for the left side of the footer
         */
        buttonArrayLeft: React.PropTypes.array,
        /**
         *This is an array of buttons for the right side of the footer
         */
        buttonArrayRight: React.PropTypes.array
    },
    renderQBIcon() {
        let isSmall = Breakpoints.isSmallBreakpoint();
        //This function checks to see if there is a QBIcon
            //if there is a QBIcon then it will be placed on the page according to XD specs
            //if there is not a QBIcon then it will not render anything to the page
        if (this.props.modalQBIcon && this.props.modalTitle && !isSmall) {
            return <div className="largeModalQBIcon">
                {this.props.modalQBIcon}
            </div>;
        }
        if (this.props.modalQBIcon) {
            return <div className="modalQBIcon">
                {this.props.modalQBIcon}
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
                <div className="smallPrimaryButton" >{this.props.buttonArrayRight[1]}</div>
                <div className="smallSecondaryButton">{this.props.buttonArrayRight[0]}</div>
                <div className="smallTertiaryButton">{this.props.buttonArrayLeft[0]}</div>
            </div>;
        }
        if (this.props.buttonArrayLeft && this.props.buttonArrayRight) {
            if (this.props.buttonArrayLeft.length + this.props.buttonArrayRight.length === 3) {
                return <div>
                    <div className="tertiaryButton">{this.props.buttonArrayLeft[0]}</div>
                    <div className="secondaryButton">{this.props.buttonArrayRight[0]}</div>
                    <div className="primaryButton" >{this.props.buttonArrayRight[1]}</div>
                </div>;
            }
            if (this.props.buttonArrayLeft.length + this.props.buttonArrayRight.length === 2) {
                return <div>
                    <div className="tertiaryButton">{this.props.buttonArrayLeft[0]}</div>
                    <div className="primaryButton">{this.props.buttonArrayRight[0]}</div>
                </div>;
            }
        }
        return <div className="singlePrimaryButton">
            {this.props.buttonArrayRight[0]}
        </div>;
    },
    render() {
        let modalTitleAndBody = "modalTitleAndBody";
        if (this.props.modalTitle && this.props.modalQBIcon) {
            modalTitleAndBody = "modalTitleAndBodyAndQBIcon";
        }
        return (
            <div>
                <Modal className="qbModal" show={this.props.bool} onHclassNamee={this.close}>
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

export default QBModals;
