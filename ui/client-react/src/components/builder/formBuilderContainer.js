import React, {PropTypes} from 'react';
import {Button} from 'react-bootstrap';
import {I18nMessage} from '../../utils/i18nMessage';
import {connect} from 'react-redux';
import {loadForm, updateForm, moveFieldOnForm} from '../../actions/formActions';
import Loader from 'react-loader';
import {LARGE_BREAKPOINT} from "../../constants/spinnerConfigurations";
import {NEW_FORM_RECORD_ID} from '../../constants/schema';
import ToolPalette from './builderMenus/toolPalette';
import FieldProperties from './builderMenus/fieldProperties';
import FormBuilder from '../formBuilder/formBuilder';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter';
import AppHistory from '../../globals/appHistory';
import Logger from '../../utils/logger';
import './formBuilderContainer.scss';
import withScrolling from 'react-dnd-scrollzone';

let logger = new Logger();

const ScrollZone = withScrolling('div');
const scrollStyle = {
    overflowX: 'scroll',
    overflowY: 'scroll',
}

const mapStateToProps = state => {
    return {
        forms: state.forms
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadForm(appId, tableId, reportId, formType, recordId) {
            return dispatch(loadForm(appId, tableId, reportId, formType, recordId));
        },

        moveField(formId, newLocation, draggedItemProps) {
            return dispatch(moveFieldOnForm(formId, newLocation, draggedItemProps));
        },

        updateForm(appId, tblId, formType, form) {
            return dispatch(updateForm(appId, tblId, formType, form));
        }
    };
};

export const FormBuilderContainer = React.createClass({
    propTypes: {
        /**
         * the app id
         * */
        appId: PropTypes.string,
        /**
         * the table id
         * */
        tblId: PropTypes.string,
        /**
         * the form id
         * */
        formId: PropTypes.string,
        /**
         * the form type
         * */
        formType: PropTypes.string
    },


    startScrolling (scrollDirection) {
        let body = document.body;
        let container = document.getElementsByClassName("formBuilderContent")[0];
        let scrollTop = container.scrollTop;
        let scrollHeight = container.scrollHeight;
        var clientHeight = container.clientHeight;

        if (scrollDirection === 'scrollDown') {
            console.log('============================================START SCROLLING DOWN');
            console.log('container.scrollTop: ', container.scrollTop);
            /////////Works On desktop//////
            console.log('scrollHeight: ', scrollHeight, '\nscrollTopt: ', scrollTop ,'\nscrollHeight - scrollTop: ',  scrollHeight - scrollTop);
            container.scrollTop = scrollTop + 100;///////
            //////////////////////////////

            console.log('window.pageYOffset: ', window.pageYOffset);
            console.log('window.pageXOffset: ', window.pageYOffset);

            // body.scrollTop = 0;
            container.animate({ scrollTop: 0 }, "fast");
            // window.scrollTo(0, 1);
            // window.pageYOffset = 100;
            // document.body.scrollTop = 0;
            // document.getElementsByClassName("formBuilderContent")[0].scrollLeft = 100;
            // window.scrollBy(0, 100);
        } else if (scrollDirection === 'scrollUp') {
            console.log('============================================START SCROLLING UP');
            console.log('container.scrollTop: ', container.scrollTop);
            /////////Works On desktop//////
            console.log('scrollHeight: ', scrollHeight, '\nscrollTop: ', scrollTop ,'\nscrollHeight - scrollTop: ',  scrollHeight - scrollTop);

            container.scrollTop = scrollTop - 100;///////
            //////////////////////////////


            console.log('window.pageYOffset: ', window.pageYOffset);
            console.log('window.pageXOffset: ', window.pageXOffset);

            container.animate({ scrollTop: 0 }, "fast");
            // body.scrollTop = 0;
            // window.pageYOffset = 100;
            // window.scrollTo(0, 1);
            // document.body.scrollTop = 0;
            // document.getElementsByClassName("formBuilderContent")[0].scrollLeft = 100;
            // window.scrollBy(0, -100);
        }
    },

    updateScrolling(evt) {

        let pointerX;
        let pointerY;
        let containerHeight = this.getContainerSize();

        if (evt.type === 'touchmove') {
            pointerX = evt.touches[0].clientX;
            pointerY = evt.touches[0].clientY;
            // console.log('touch x: ', pointerX, '\ntouchY: ', pointerY,'\ncontainerHeight: ', containerHeight);
        } else {
            pointerX = evt.clientX;
            pointerY = evt.clientY;
            // console.log('mouse x: ', pointerX, '\nmouseY: ', pointerY,'\ncontainerHeight: ', containerHeight);
        }

        if (containerHeight - pointerY < 10) {
            this.startScrolling('scrollDown');
        } else if (pointerY < 20) {
            this.startScrolling('scrollUp');
        }
    },

    stopScrolling() {
        document.removeEventListener("mousemove", this.updateScrolling);
    },

    activateMouseMove() {
        document.addEventListener("mousemove", this.updateScrolling);
    },

    getContainerSize() {
        let container = document.getElementsByClassName("formBuilderContent")[0].clientHeight;
        return container;
    },

    componentDidMount() {
        // We use the NEW_FORM_RECORD_ID so that the form does not load any record data
        this.props.loadForm(this.props.appId, this.props.tblId, null, (this.props.formType || 'view'), NEW_FORM_RECORD_ID);

        this.getContainerSize();

        document.addEventListener("touchmove", this.updateScrolling);
        document.addEventListener("touchend", this.stopScrolling);

        // document.addEventListener("dragover", this.updateScrolling);
        // document.addEventListener("dragend", this.stopScrolling);

        document.addEventListener("mousedown", this.activateMouseMove);
        document.addEventListener("mouseup", this.stopScrolling);


    },

    onCancel() {
        AppHistory.history.goBack();
    },

    saveClicked() {
        // get the form meta data from the store..hard code offset for now...this is going to change..
        if (this.props.forms && this.props.forms.length > 0 && this.props.forms[0].formData) {
            let formMeta = this.props.forms[0].formData.formMeta;
            let formType = this.props.forms[0].formData.formType;
            this.props.updateForm(formMeta.appId, formMeta.tableId, formType, formMeta);
        }
    },

    getRightAlignedButtons() {
        return (
            <div>
                <Button bsStyle="primary" onClick={this.onCancel} className="cancelFormButton"><I18nMessage message="nav.cancel"/></Button>
                <Button bsStyle="primary" onClick={this.saveClicked} className="saveFormButton"><I18nMessage message="nav.save"/></Button>
            </div>
        );
    },

    /**
     *  get actions element for bottom center of trowser (placeholders for now)
     */
    getTrowserActions() {
        return (
            <div className={"centerActions"} />);
    },

    getSaveOrCancelFooter() {
        return <SaveOrCancelFooter
            rightAlignedButtons={this.getRightAlignedButtons()}
            centerAlignedButtons={this.getTrowserActions()}
            leftAlignedButtons={this.getTrowserActions()}
        />;
    },

    render() {
        let loaded = (_.has(this.props, 'forms') && this.props.forms.length > 0 && !this.props.forms[0].loading);

        let formData = null;
        let formId = null;
        if (loaded) {
            formId = this.props.forms[0].id;
            formData = this.props.forms[0].formData;
        }
        return (
            <div className="formBuilderContainer">
                <ToolPalette />

                <div className="formBuilderContent">
                    <Loader loaded={loaded} options={LARGE_BREAKPOINT}>
                        <FormBuilder formId={formId} formData={formData} moveFieldOnForm={this.props.moveField} />
                    </Loader>
                </div>

                {this.getSaveOrCancelFooter()}

                <FieldProperties />
            </div>
        );
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FormBuilderContainer);
