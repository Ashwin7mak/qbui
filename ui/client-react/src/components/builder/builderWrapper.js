import React, {PropTypes} from 'react';
import './builderWrapper.scss';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter'


const BuilderWrapper = React.createClass({
    // _hasErrorsAndAttemptedSave() {
    //     return (_.has(this.props, 'pendEdits.editErrors.errors') && this.props.pendEdits.editErrors.errors.length > 0 && this.props.pendEdits.hasAttemptedSave);
    // },
    //
    // _doesNotHaveErrors() {
    //     return (!_.has(this.props, 'pendEdits.editErrors.errors') || this.props.pendEdits.editErrors.errors.length === 0 || !this.props.pendEdits.hasAttemptedSave);
    // },
    /**
     * User wants to save changes to a record. First we do client side validation
     * and if validation is successful we initiate the save action for the new or existing record
     * if validation if not ok we stay in edit mode and show the errors (TBD)
     * @param saveAnother if true, keep trowser open after save with a new blank record
     * @returns {boolean}
     */
    saveClicked(saveAnother = false) {
        //validate changed values -- this is skipped for now
        //get pending changes
        let validationResult = {
            ok : true,
            errors: []
        };

        if (validationResult.ok) {
            //signal record save action, will update an existing records with changed values
            // or add a new record
            let promise;

            const formType = "edit";

            this.props.savingForm(formType);
            if (this.props.recId === SchemaConsts.UNSAVED_RECORD_ID) {
                promise = this.handleRecordAdd(this.props.pendEdits.recordChanges);
            } else {
                promise = this.handleRecordChange(this.props.recId);
            }
            promise.then((recId) => {
                this.props.saveFormSuccess(formType);

                if (this.props.viewingRecordId === recId) {
                    this.props.syncForm("view");
                }

                if (saveAnother) {
                    this.props.editNewRecord(false);
                } else {
                    this.hideTrowser();
                    this.navigateToNewRecord(recId);
                }

            }, (errorStatus) => {
                this.props.saveFormError(formType, errorStatus);
                this.showErrorDialog();
            });
        }
        return validationResult;
    },

    saveOrCancelFooter() {
        return <SaveOrCancelFooter
            reportData={this.props.reportData}
            shell={this.props.shell}
            toggleErrorDialog={this.toggleErrorDialog}
            saveAndNextClicked={this.saveAndNextClicked}
            saveClicked={this.saveClicked}
            recId={this.recId}
            hasErrorsAndAttemptedSave={this._hasErrorsAndAttemptedSave}
        />
    },
    render() {
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                saveOrCancelFooter: this.saveOrCancelFooter()
            })
        );

        return (
            <div className="builderWrapper" >
                {childrenWithProps}
            </div>
        );
    }
});

export default BuilderWrapper;
