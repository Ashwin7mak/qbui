import React from 'react';
import {Modal} from 'react-bootstrap';
import './qbModal.scss';

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
        title: React.PropTypes.string,
        /**
         *This is the QBIcon for the modal body
         */
        modalBodyQBIcon: React.PropTypes.array,
        /**
         *This is an array of buttons for the left side of the footer
         */
        buttonArrayLeft: React.PropTypes.array,
        /**
         *This is an array of buttons for the right side of the footer
         */
        buttonArrayRight: React.PropTypes.array
    },
    qbIconFunction() {
        //This function checks to see if there is a QBIcon
            //if there is a QBIcon then it will be placed on the page according to XD specs
            //if there is not a QBIcon then it will not render anything to the page
        if (this.props.modalBodyQBIcon) {
            return <div className="modalQBIcon">
                {this.props.modalBodyQBIcon}
            </div>;
        }
        return null;
    },
    titleAndBodyFunction() {},
    buttonFunction() {
        //This functions checks to see how many buttons the modal has
            //It will place and style the buttons based off of the total button count
        if (this.props.buttonArrayLeft && this.props.buttonArrayRight) {
            if (this.props.buttonArrayLeft.length + this.props.buttonArrayRight.length === 3) {
                return <div>
                    <div id="tertiaryButton">{this.props.buttonArrayLeft[0]}</div>
                    <div id="secondaryButton">{this.props.buttonArrayRight[0]}</div>
                    <div id="primaryButton" >{this.props.buttonArrayRight[1]}</div>
                </div>;
            }
            if (this.props.buttonArrayLeft.length + this.props.buttonArrayRight.length === 2) {
                return <div>
                    <div id="tertiaryButton">{this.props.buttonArrayLeft[0]}</div>
                    <div id="primaryButton">{this.props.buttonArrayRight[0]}</div>
                </div>;
            }
        }
        return <div id="singlePrimaryButton">
            {this.props.buttonArrayRight[0]}
        </div>;
    },
    render() {
        return <div>
            <Modal show={this.props.bool} onHide={this.close}>
                <div>
                    {this.qbIconFunction()}
                    <div className="modalTitleAndBody">
                        <Modal.Title>
                            {this.props.title}
                        </Modal.Title>
                        <Modal.Body>
                            {this.props.modalBodyMessage}
                        </Modal.Body>
                    </div>
                </div>
                    <Modal.Footer>
                        {this.buttonFunction()}
                    </Modal.Footer>
            </Modal>
        </div>;
    }
});

export default QBModals;
