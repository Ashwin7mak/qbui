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

    updateScrolling(evt) {
        console.log('formBuilderContainer:  I have been activated!');
        console.log('Mouse x: ', evt.clientX, '\nMouse y: ', evt.clientY);

        let clientX = evt.touches[0].clientX;
        let clientY = evt.touches[0].clientY;

        console.log('touch x: ', clientX, '\ntouchY: ', clientY);

    },

    stopScrolling() {
      console.log('formBuilderContainer: I stopped moving!!!!');
        document.removeEventListener("mousemove", this.updateScrolling);
    },

    activateMouseMove() {
        document.addEventListener("mousemove", this.updateScrolling(evt));
    },

    componentDidMount() {
        // We use the NEW_FORM_RECORD_ID so that the form does not load any record data
        this.props.loadForm(this.props.appId, this.props.tblId, null, (this.props.formType || 'view'), NEW_FORM_RECORD_ID);

        document.addEventListener("touchmove", this.updateScrolling);
        document.addEventListener("touchend", this.stopScrolling);

        document.addEventListener("dragover", this.updateScrolling);
        document.addEventListener("dragend", this.stopScrolling);

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

                <ScrollZone style={scrollStyle} >

                <div className="formBuilderContent">
                    <Loader loaded={loaded} options={LARGE_BREAKPOINT}>
                        <FormBuilder formId={formId} formData={formData} moveFieldOnForm={this.props.moveField} />
                    </Loader>
                </div>

                </ScrollZone>

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
