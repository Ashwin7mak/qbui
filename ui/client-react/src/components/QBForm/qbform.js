import React from 'react';
import QBPanel from '../QBPanel/qbpanel.js';
import Tabs, {TabPane} from 'rc-tabs';
import Fluxxor from 'fluxxor';
import _ from 'lodash';
import './qbform.scss';
import './tabs.scss';
const serverTypeConsts = require('../../../../common/src/constants');
import {CellValueRenderer} from '../dataTable/agGrid/cellValueRenderers';
import Locale from '../../locales/locales';

let FluxMixin = Fluxxor.FluxMixin(React);
/*
 Custom QuickBase Form component that has 1 property.
 activeTab: the tab we want to display first when viewing the form, defaults to the first tab
 */
let QBForm = React.createClass({
    mixins: [FluxMixin],
    propTypes: {
        activeTab: React.PropTypes.string
    },
    contextTypes: {
        touch: React.PropTypes.bool
    },

    getDefaultProps: function() {
        return {
            activeTab: '0'
        };
    },

    createFieldElement(element, sectionIndex, labelPosition) {
        let record = this.props.formData.record || [];
        let fields = this.props.formData.fields || [];

        let relatedField = _.find(fields, function(field) {
            if (field.id === element.fieldId) {
                return true;
            }
        });

        let fieldDatatypeAttributes = relatedField && relatedField.datatypeAttributes ? relatedField.datatypeAttributes : {};
        let fieldType = fieldDatatypeAttributes.type;

        let fieldRecord = _.find(record, function(val) {
            if (val.id === element.fieldId) {
                return true;
            }
        });

        //skip the user fields - these arent implemented.
        //TODO: this should be removed once user fields are implemented
        if (fieldType === "USER") {
            fieldRecord = "";
        }

        //catch the non-implemented pieces.
        let fieldDisplayValue = fieldRecord ? fieldRecord.display : "display value";
        let fieldRawValue = fieldRecord ? fieldRecord.value : "raw value";

        let fieldLabel = "";
        if (element.useAlternateLabel) {
            fieldLabel = element.displayText;
        } else {
            fieldLabel = relatedField ? relatedField.name : "display label";
        }

        let key = "field" + sectionIndex + "-" + element.orderIndex;

        let classes = "formElement field ";
        classes += labelPosition === "ABOVE" ? "labelAbove" : "labelLeft";

        return (
            <div key={key} className={classes}>
                <span className={"fieldLabel"}>{fieldLabel}</span>
                <span className="cellWrapper">
                    {fieldDisplayValue !== null &&
                    <CellValueRenderer type={fieldType}
                               value={fieldRawValue}
                               display={fieldDisplayValue}
                               attributes={fieldDatatypeAttributes}
                    />  }
                </span>
            </div>
        );
    },
    createTextElement(element, sectionIndex) {
        let key = "field" + sectionIndex + "-" + element.orderIndex;
        return <div key={key} className="formElement text">{element.displayText}</div>;
    },
    createRow(fields) {
        return <div className="fieldRow">{fields}</div>;
    },

    createSection(section) {
        let sectionTitle = "";
        let fieldLabelPosition = "";

        //build the section header.
        if (section.headerElement && section.headerElement.FormHeaderElement && section.headerElement.FormHeaderElement) {
            sectionTitle = section.headerElement.FormHeaderElement.displayText ? section.headerElement.FormHeaderElement.displayText : "";
            fieldLabelPosition = section.headerElement.FormHeaderElement.position;
        }

        //build each of the elements, stuff them into one row for now
        let elements = [];
        _.each(section.elements, (element) => {
            if (element.FormTextElement) {
                elements.push(this.createTextElement(element.FormTextElement, section.orderIndex));
            } else if (element.FormFieldElement) {
                elements.push(this.createFieldElement(element.FormFieldElement, section.orderIndex, fieldLabelPosition));
            }  else {
                //unknown element type.. not sure how to render.
            }
        });

        return (
            <QBPanel className="formSection" title={sectionTitle} key={"section" + section.orderIndex} isOpen={true} panelNum={section.orderIndex}>
                {this.createRow(elements)}
            </QBPanel>
        );
    },

    createTab(tab) {
        let sections = [];
        _.each(tab.sections, (section, idx) => {
            sections.push(this.createSection(section));
        });
        return (
            <TabPane key={tab.orderIndex} tab={tab.title || Locale.getMessage("form.tab") + ' ' + tab.orderIndex}>
                <br/>
                {sections}
            </TabPane>
        );
    },

    render() {
        let tabs = [];
        let errorMsg = '';

        //  If there is an errorStatus, display the appropriate message based on the error code; otherwise
        //  render the form with the supplied data(if any).
        //  TODO: when error handling is implemented beyond forms, the thinking is that an error component
        //  TODO: should be created to replace the below and handle the locale messaging and rendering of
        //  TODO: a common error page.
        if (this.props.errorStatus) {
            if (this.props.errorStatus === 403) {
                errorMsg = Locale.getMessage("form.error.403");
            } else {
                errorMsg = Locale.getMessage("form.error.500");
            }
        } else if (this.props.formData &&  this.props.formData.formMeta && this.props.formData.formMeta.tabs) {
            _.each(this.props.formData.formMeta.tabs, (tab, index) => {
                tabs.push(this.createTab(tab));
            });
        }

        return (
            <div className="formContainer">
                <form>
                    {errorMsg ? errorMsg :
                        <Tabs activeKey={this.props.activeTab}>
                            {tabs}
                        </Tabs>
                    }
                </form>
            </div>
        );
    }
});

export default QBForm;
