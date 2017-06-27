import React from 'react';
import {PropTypes} from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Icon from 'REUSE/components/icon/icon';
import Loader from 'react-loader';
import KeyboardShortcuts from '../../../../../reuse/client/src/components/keyboardShortcuts/keyboardShortcuts';
import {I18nMessage} from 'REUSE/utils/i18nMessage';
import Locale from 'REUSE/locales/locale';
import Tooltip from 'REUSE/components/tooltip/tooltip';
import * as SpinnerConfigurations from "../../../../../client-react/src/constants/spinnerConfigurations";

import './multiStepDialog.scss';
import '../../../../../reuse/client/src/components/iconActions/iconActions.scss';

/**
 * # Multi-step Dialog
 * A dialog containing multiple pages (a wizard)
 * ## Usage
 * ```
 *   <MultiStepDialog ...props>
 *       <PageOneComponent>
 *       <PageTwoComponent>
 *           ...
 *   </MultiStepDialog>
 */
class MultiStepDialog extends React.Component {

    constructor(props) {
        super(props);

        // use state only to determine which transition classes to apply
        // to slide right vs slide left - this is an internal rendering
        // property only and doesn't really belong in the Redux store
        this.state = {
            transitionName: "next"
        };

        this.cancelClicked = this.cancelClicked.bind(this);
        this.nextClicked = this.nextClicked.bind(this);
        this.previousClicked = this.previousClicked.bind(this);
        this.finishClicked = this.finishClicked.bind(this);
    }

    renderTitle() {

        return this.props.titles && (
            <Modal.Title>{this.props.titles[this.props.pageIndex]}</Modal.Title>);
    }

    renderIcons() {
        return (
            <div className={"multiStepDialogRightIcons"}>
                <button className="closeButton" onClick={this.cancelClicked}><Icon icon={"close"}/></button>
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
        const showFinishedText = this.props.showFinishedText;
        return (
            <Modal.Footer>
                <div className="buttons">
                    <span className="spacer"/>
                    {this.props.showCancelButton &&
                        <Button className="cancelButton" onClick={this.cancelClicked}><I18nMessage message="nav.cancel"/></Button>}
                    {this.props.show ? <KeyboardShortcuts id="modalDialog"
                                                             shortcutBindingsPreventDefault={[
                                                                 {key: 'esc', callback: () => {this.cancelClicked(); return false;}}
                                                             ]} /> : null}
                    {showPrevious &&
                        <Button className="previousButton" onClick={this.previousClicked}><I18nMessage message="nav.previous"/></Button>}
                    {showNext &&
                        <Button className="nextButton" bsStyle="primary" disabled={!this.props.canProceed} onClick={this.nextClicked}><I18nMessage message="nav.next"/></Button>}
                    {showFinished &&
                        <Button className={showFinishedText ? "finishedText" : "finishedButton"} bsStyle="primary" disabled={!this.props.canProceed} onClick={this.finishClicked}>
                            {(this.props.finishedTooltip && !this.props.canProceed) ?
                            <Tooltip plainMessage={this.props.finishedTooltip} placement="top">
                                {this.props.finishedButtonLabel}
                            </Tooltip> : this.props.finishedButtonLabel}
                        </Button>}
                </div>
            </Modal.Footer>
        );
    }

    componentWillReceiveProps(nextProps) {

        /* set transition name based on the navigation direction */
        if (nextProps.pageIndex !== this.props.pageIndex) {
            this.setState({transitionName: nextProps.pageIndex > this.props.pageIndex ? "next" : "previous"});
        }
    }

    /**
     * wrap children (pages) in stepContainer with key for consistent styling and animation
     * @returns {XML[]}
     */
    getWrappedPages() {
        return React.Children.map(this.props.children, (child, i) => <div className="pageContainer" key={i}>{child}</div>);
    }

    render() {
        let classes = ['multiStepModal'];

        if (this.props.fixedHeight) {
            classes.push('absolutePageContainer');
        }
        if (this.props.classes) {
            classes = [...classes, this.props.classes];
        }
        let savingRole = this.props.savingRole || false;
        const panels = this.getWrappedPages();
        return (
            <div>
                <Modal className={classes.join(' ')} show={this.props.show}>
                    <Loader loadedClassName="transitionGroup" loaded={!savingRole} options={SpinnerConfigurations.CHANGE_ROLE}>
                        {this.renderIcons()}

                        <div className="bodyContainer">

                            {this.renderTitle()}

                            <Modal.Body>
                                <Loader loaded={!this.props.isLoading}>
                                    <ReactCSSTransitionGroup transitionName={this.state.transitionName}
                                                             transitionEnterTimeout={300}
                                                             transitionLeaveTimeout={300}>
                                        {panels[this.props.pageIndex]}
                                    </ReactCSSTransitionGroup>
                                </Loader>
                            </Modal.Body>

                        </div>
                        {this.renderButtons()}
            </Loader>
                </Modal>
            </div>);
    }
}

MultiStepDialog.propTypes = {
    /**
     * show the dialog? */
    show: PropTypes.bool.isRequired,
    /**
     * array of page titles (1 per child)
     */
    titles: PropTypes.arrayOf(PropTypes.string),
    /**
     * page index to display
     */
    pageIndex: PropTypes.number,
    /**
     * cancel callback (client should set show prop to false)
     */
    onCancel: PropTypes.func,
    /**
     * show the cancel button
     */
    showCancelButton: PropTypes.bool,
    /**
     * next page (client should increment pageIndex)
     */
    onNext: PropTypes.func,
    /**
     * previous page (client should decrement pageIndex)
     */
    onPrevious: PropTypes.func,
    /**
     * finished callback (client should hide dialog and process it)
     */
    onFinished: PropTypes.func.isRequired,
    /**
     * enable next/finished button?
     */
    canProceed: PropTypes.bool,
    /**
     * display loading spinner?
     */
    loading: PropTypes.bool,
    /**
     * additional classes
     */
    classes: PropTypes.string,
    /**
     *
     */
    finishedButtonLabel: PropTypes.string,
    /**
     *
     */
    fixedHeight: PropTypes.bool,
};

MultiStepDialog.defaultProps = {
    pageIndex: 0,
    canProceed: true,
    isLoading: false,
    showCancelButton: true,
    finishedButtonLabel: Locale.getMessage("nav.finished"),
    fixedHeight: true
};

export default MultiStepDialog;
