import React from 'react';
import {PropTypes} from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReIcon from '../reIcon/reIcon';
import Loader from 'react-loader';

import './multiStepDialog.scss';


class MultiStepDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            transitionName: "next"
        };

        this.cancelClicked = this.cancelClicked.bind(this);
        this.nextClicked = this.nextClicked.bind(this);
        this.previousClicked = this.previousClicked.bind(this);
        this.finishClicked = this.finishClicked.bind(this);
    }

    renderTitle() {

        return this.props.title && (
            <Modal.Title>
                {this.props.title}
            </Modal.Title>);
    }

    renderIcons() {
        return (
            <div className={"rightIcons"}>
                <button><ReIcon icon={"help"}/></button>
                <button onClick={this.cancelClicked}><ReIcon icon={"close"}/></button>
            </div>);
    }

    cancelClicked() {
        this.props.onCancel();
    }

    nextClicked() {
        this.props.onNext();
    }
    finishClicked() {
        this.props.onFinished();

    }
    previousClicked() {
        this.props.onPrevious();
    }

    renderButtons() {

        const numPages = React.Children.count(this.props.children);

        const showPrevious = this.props.pageIndex > 0;
        const showNext = this.props.pageIndex < numPages - 1;
        const showFinished = this.props.pageIndex === numPages - 1;
        return (
            <Modal.Footer>
                <div className="buttons">
                    <span className="spacer"/>
                    <Button className="cancelButton" onClick={this.cancelClicked}>Cancel</Button>

                    {showPrevious &&
                        <Button onClick={this.previousClicked}>Previous</Button>}
                    {showNext &&
                        <Button bsStyle="primary" disabled={!this.props.canProceed} onClick={this.nextClicked}>Next</Button>}
                    {showFinished &&
                        <Button bsStyle="primary" disabled={!this.props.canProceed} onClick={this.finishClicked}>Finished</Button>}
                </div>
            </Modal.Footer>
        );
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.pageIndex !== this.props.pageIndex) {
            this.setState({transitionName: nextProps.pageIndex > this.props.pageIndex ? "next" : "previous"});
        }
    }

    /**
     * wrap children (pages) in stepContainer with key for consistent styling and animatio
     * @returns {XML[]}
     */
    getWrappedPages() {
        return React.Children.map(this.props.children, (child, i) => <div className="pageContainer" key={i}>{child}</div>);
    }

    render() {
        let classes = ['multiStepModal'];
        if (this.props.classes) {
            classes = [...classes, this.props.classes];
        }

        const panels = this.getWrappedPages();
        return (
            <div>
                <Modal className={classes.join(' ')} show={this.props.show}>

                        {this.renderIcons()}
                        <div className="bodyContainer">

                                {this.renderTitle()}

                                <Modal.Body>
                                    <Loader loaded={!this.props.loading}>
                                    <ReactCSSTransitionGroup transitionName={this.state.transitionName}
                                                             transitionEnterTimeout={300}
                                                             transitionLeaveTimeout={300}>
                                        {panels[this.props.pageIndex]}
                                    </ReactCSSTransitionGroup>
                                    </Loader>
                                </Modal.Body>

                        </div>
                        {this.renderButtons()}

                </Modal>
            </div>);
    }
}

MultiStepDialog.propTypes = {
    pageIndex: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onFinished: PropTypes.func.isRequired,
    canProceed: PropTypes.bool,
    loading: PropTypes.bool
};

MultiStepDialog.defaultProps = {
    canProceed: true,
    loading: false
};

export default MultiStepDialog;
